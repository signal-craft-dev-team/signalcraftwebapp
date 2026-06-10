import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Header } from '../../shared/Header';
import { BottomNav } from '../../shared/BottomNav';
import { EntrySplash } from './home/EntrySplash';
import { HomeGreeting } from './home/HomeGreeting';
import { MaintenanceCallButton } from './home/MaintenanceCallButton';
import { apiFetch } from '@/lib/api';
import { throwIfNotOk } from '@/lib/apiErrorHelper';
import { QUERY_KEYS } from '@/lib/queryKeys';
import type { MeResponse } from '@/lib/contracts/cloudRunApi';
import {
    meResponseToUserProfile,
    type UserProfile,
} from '@/lib/contracts/userProfileAdapter';

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

                        {/* TODO: StatusOverviewSection — /dashboard/home.statusOverview 대체 API 확정 후 복구 */}
                        {/* TODO: EquipmentSummarySection — /dashboard/home.equipmentSummary 대체 API 확정 후 복구 */}
                        {/* TODO: EquipmentUsageSection — /dashboard/home.equipmentUsage 대체 API 확정 후 복구 */}

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
