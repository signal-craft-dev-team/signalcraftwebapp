import { useCallback, useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Header } from '../../shared/Header';
import { BottomNav } from '../../shared/BottomNav';
import { EntrySplash } from './home/EntrySplash';
import { HomeGreeting } from './home/HomeGreeting';
import { MaintenanceCallButton } from './home/MaintenanceCallButton';
import { StatusOverviewSection } from './home/StatusOverviewSection';
import { EquipmentSummarySection } from './home/EquipmentSummarySection';
import { EquipmentUsageSection } from './home/EquipmentUsageSection';
import { apiFetch } from '@/lib/api';
import { throwIfNotOk } from '@/lib/apiErrorHelper';
import { QUERY_KEYS } from '@/lib/queryKeys';
import type { MeResponse, MachinesResponse, MachineDetailResponse, StatusSegment } from '@/lib/contracts/cloudRunApi';
import type { StatusOverviewCard, EquipmentSummaryItem, EquipmentUsageData, GanttSegment, HomePeriod, EquipmentRunState } from '@/lib/contracts/dashboardHome';
import {
    meResponseToUserProfile,
    type UserProfile,
} from '@/lib/contracts/userProfileAdapter';

const PERIOD_OPTIONS: Array<{ id: HomePeriod; label: string }> = [
    { id: '24h', label: '24시간' },
    { id: '3d', label: '3일' },
    { id: '5d', label: '5일' },
    { id: '7d', label: '7일' },
];

const SEGMENT_STATE_MAP: Record<StatusSegment['state'], EquipmentRunState> = {
    running: 'RUNNING',
    stopped: 'OFF',
    no_data: 'NO_DATA',
};

const PERIOD_BUCKET_MINUTES: Record<HomePeriod, number> = {
    '24h': 5,
    '3d': 15,
    '5d': 30,
    '7d': 30,
};

function segmentsFromApi(
    machineId: string,
    statusSegments: StatusSegment[],
    period: HomePeriod,
): GanttSegment[] {
    if (!statusSegments?.length) return [];

    const bucketMs = PERIOD_BUCKET_MINUTES[period] * 60 * 1000;

    return statusSegments.map((seg, i) => ({
        machineId,
        state: SEGMENT_STATE_MAP[seg.state] ?? 'NO_DATA',
        startedAt: seg.bucket_start,
        endedAt: statusSegments[i + 1]?.bucket_start
            ?? new Date(new Date(seg.bucket_start).getTime() + bucketMs).toISOString(),
    }));
}

const ENTRY_SPLASH_FLAG = 'signalcraft:entrySplashShown';

function shouldShowEntrySplash(): boolean {
    if (typeof window === 'undefined') return false;
    try {
        return window.sessionStorage.getItem(ENTRY_SPLASH_FLAG) === null;
    } catch {
        return false;
    }
}

export function DashboardPage() {
    const [showEntrySplash, setShowEntrySplash] = useState<boolean>(shouldShowEntrySplash);
    const [selectedPeriod, setSelectedPeriod] = useState<HomePeriod>('24h');
    const [selectedMachineId, setSelectedMachineId] = useState<string>('');

    const dismissEntrySplash = useCallback(() => {
        try {
            window.sessionStorage.setItem(ENTRY_SPLASH_FLAG, '1');
        } catch { /* Safari private 등 무시 */ }
        setShowEntrySplash(false);
    }, []);

    const { data: profile, isPending } = useQuery<UserProfile>({
        queryKey: QUERY_KEYS.userProfile,
        queryFn: async () => {
            const response = await throwIfNotOk(await apiFetch('/me'), '/me');
            const me = (await response.json()) as MeResponse;
            return meResponseToUserProfile(me);
        },
    });

    const { data: machinesData } = useQuery<{
        statusOverview: StatusOverviewCard[];
        equipmentSummary: EquipmentSummaryItem[];
    }>({
        queryKey: QUERY_KEYS.machines,
        queryFn: async () => {
            const response = await throwIfNotOk(await apiFetch('/machines'), '/machines');
            const { machines } = (await response.json()) as MachinesResponse;
            const total = machines.length;

            const machinesHealthy = machines.filter(m => m.operational_state === 'running').length;
            const hasError = machines.some(m =>
                m.operational_state === 'error' || m.operational_state === 'unknown'
            );
            const machineState = machinesHealthy > 0
                ? 'healthy'
                : hasError ? 'danger' : 'warning';

            const statusOverview: StatusOverviewCard[] = [
                {
                    id: 'machines' as const,
                    title: '전체 설비',
                    state: machineState,
                    healthyCount: machinesHealthy,
                    totalCount: total,
                    description: '설비 가동 상태',
                },
            ];

            const equipmentSummary: EquipmentSummaryItem[] = machines.map(m => ({
                id: m.machine_id,
                name: m.label ?? m.machine_code,
                type: m.machine_code,
                state: m.operational_state === 'running' ? 'RUNNING' : 'OFF',
            }));

            return { statusOverview, equipmentSummary };
        },
        refetchInterval: 5 * 60 * 1000,
        refetchIntervalInBackground: false,
    });

    useEffect(() => {
        if (!selectedMachineId && machinesData?.equipmentSummary[0]?.id) {
            setSelectedMachineId(machinesData.equipmentSummary[0].id);
        }
    }, [machinesData, selectedMachineId]);

    const effectiveMachineId = selectedMachineId || machinesData?.equipmentSummary[0]?.id || '';

    const { data: usageData } = useQuery<EquipmentUsageData>({
        queryKey: QUERY_KEYS.machineDetail(effectiveMachineId, selectedPeriod),
        queryFn: async () => {
            const response = await throwIfNotOk(
                await apiFetch(`/machines/${effectiveMachineId}?period=${selectedPeriod}`),
                `/machines/${effectiveMachineId}`
            );
            const detail = (await response.json()) as MachineDetailResponse;
            const machines = (machinesData?.equipmentSummary ?? []).map(m => ({ id: m.id, name: m.name }));
            const periodStartAt = detail.status_segments[0]?.bucket_start ?? new Date().toISOString();
            let periodEndAt: string;
            if (selectedPeriod === '24h') {
                const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
                const kstNow = new Date(Date.now() + KST_OFFSET_MS);
                kstNow.setUTCHours(0, 0, 0, 0);
                kstNow.setUTCDate(kstNow.getUTCDate() + 1);
                periodEndAt = new Date(kstNow.getTime() - KST_OFFSET_MS).toISOString();
            } else {
                periodEndAt = new Date().toISOString();
            }
            const segments = segmentsFromApi(effectiveMachineId, detail.status_segments, selectedPeriod);
            return {
                selectedPeriod,
                periodOptions: PERIOD_OPTIONS,
                machines,
                segments,
                periodStartAt,
                periodEndAt,
                summary: { runningMinutes: 0, offMinutes: 0 },
            };
        },
        enabled: !!effectiveMachineId,
        placeholderData: keepPreviousData,
        refetchInterval: 5 * 60 * 1000,
        refetchIntervalInBackground: false,
    });

    return (
        <div className="flex flex-col min-h-screen pb-8 bg-background">
            <Header />
            <main className="flex-1 overflow-y-auto pt-4">
                {isPending ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                        <Loader2 className="size-8 animate-spin" />
                        <p className="font-medium text-sm">데이터를 불러오는 중이에요</p>
                    </div>
                ) : (
                    <>
                        <HomeGreeting
                            fullName={profile?.customer_name || '사용자'}
                            lastUpdatedAt={new Date().toISOString()}
                        />

                        {machinesData?.statusOverview && (
                            <StatusOverviewSection
                                statusOverview={machinesData.statusOverview}
                                onHelpClick={() => {}}
                            />
                        )}

                        {machinesData?.equipmentSummary && (
                            <EquipmentSummarySection
                                items={machinesData.equipmentSummary}
                            />
                        )}

                        {usageData && (
                            <EquipmentUsageSection
                                data={{ ...usageData, selectedPeriod }}
                                onPeriodChange={(period) => setSelectedPeriod(period)}
                                onMachineChange={(machineId) => setSelectedMachineId(machineId)}
                                onHelpClick={() => {}}
                            />
                        )}

                        {profile?.primary_technician_phone && (
                            <div className="px-6 mb-10">
                                <MaintenanceCallButton
                                    phone={profile.primary_technician_phone}
                                    name={profile.primary_technician_name}
                                />
                            </div>
                        )}
                    </>
                )}
            </main>

            <BottomNav />

            <AnimatePresence>
                {showEntrySplash && (
                    <EntrySplash
                        version="v0.0.1"
                        onClose={dismissEntrySplash}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/*
// ── /dashboard/home 기반 섹션 (엔드포인트 미제공으로 주석 처리) ──────────────

import { Activity } from 'lucide-react';
import { EndpointPending } from '../../shared/EndpointPending';
import { StatusOverviewSection } from './home/StatusOverviewSection';
import { EquipmentSummarySection } from './home/EquipmentSummarySection';
import { EquipmentUsageSection } from './home/EquipmentUsageSection';
import { MaintenanceCallButton } from './home/MaintenanceCallButton';
import { HelpOverlay } from './home/HelpOverlay';
import { mockScenario } from '@/lib/mockScenario';
import type { DashboardHome, HomePeriod } from '@/lib/contracts/dashboardHome';
import { getEndpointPendingMode } from '@/lib/apiErrorHelper';

type HelpSection = 'status' | 'summary' | 'equipment' | null;

const HELP_COPY = {
    status: { title: '상태 정보 영역', description: '현재 설치된 설비의 연결 상태를 한눈에 확인할 수 있어요.' },
    summary: { title: '설비 요약 영역', description: '전체 설비의 현재 가동·정지 상태를 카드로 보여줘요.' },
    equipment: { title: '설비 정보 영역', description: '선택한 기간 동안 설비 가동 구간을 그래프로 보여줘요.' },
};

// const dashboardConfig = mockScenario.company;
// const enabledMetrics = new Set(dashboardConfig.enabledMetrics);
// const [helpSection, setHelpSection] = useState<HelpSection>(null);
// const [selectedPeriod, setSelectedPeriod] = useState<HomePeriod>('24h');

// const { data: home, isPending: isHomeLoading, error: homeError } = useQuery<DashboardHome>({
//     queryKey: QUERY_KEYS.dashboardHome,
//     queryFn: async () => {
//         const response = await throwIfNotOk(await apiFetch('/dashboard/home'), '/dashboard/home');
//         return response.json();
//     },
//     refetchInterval: 10 * 60 * 1000,
//     refetchIntervalInBackground: false,
// });

// {enabledMetrics.has('statusSummary') && (
//     <StatusOverviewSection statusOverview={home.statusOverview} onHelpClick={() => setHelpSection('status')} />
// )}
// {enabledMetrics.has('equipmentSummary') && (
//     <EquipmentSummarySection items={home.equipmentSummary} onHelpClick={() => setHelpSection('summary')} />
// )}
// {enabledMetrics.has('equipmentUsage') && (
//     <EquipmentUsageSection
//         data={{ ...home.equipmentUsage, selectedPeriod }}
//         onPeriodChange={setSelectedPeriod}
//         onMachineChange={() => {}}
//         onHelpClick={() => setHelpSection('equipment')}
//     />
// )}
// <div className="px-6 mb-10">
//     <MaintenanceCallButton phone={home.maintenancePhone} />
// </div>

// <HelpOverlay
//     isOpen={helpSection !== null}
//     title={helpSection ? HELP_COPY[helpSection].title : ''}
//     description={helpSection ? HELP_COPY[helpSection].description : ''}
//     onClose={() => setHelpSection(null)}
// />
*/
