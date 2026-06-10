export function ReportPage() {
    return null;
}

/*
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { throwIfNotOk } from '@/lib/apiErrorHelper';
import { StatRow } from './StatRow';
import { AIInsightCard } from './AIInsightCard';
import { HistoryView } from './HistoryView';
import { ShareModal } from './ShareModal';
import { CheckCircle2, AlertTriangle, ChevronDown, History, Share2, TrendingUp, Zap, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, Tooltip } from 'recharts';
import { BottomNav } from '../../shared/BottomNav';
import { Header } from '../../shared/Header';
import { cn } from '../../../lib/utils';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { chartTokens, classTokens, effects } from '@/styles/tokens';
import { useElementSize } from '@/lib/useElementSize';
import { mockScenario } from '@/lib/mockScenario';

type ViewMode = 'report' | 'history';

interface Machine {
    id: string;
    name: string;
    location: string;
}

interface DailyReport {
    id: string;
    report_date: string;
    device_id: string;
    total_runtime: number;
    cycle_count: number;
    health_score: number;
    roi_data: { saved: number };
    diagnostics: Record<string, string>;
    ai_summary: string;
    haccp_status: string;
}

const getHaccpStatusClass = (status: string) => {
    if (status === 'PASS') return classTokens.haccpStatus.PASS;
    if (status === 'WARNING') return classTokens.haccpStatus.WARNING;
    return classTokens.haccpStatus.FAIL;
};

export function ReportPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('report');
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
    const [trendChartRef, trendChartSize] = useElementSize<HTMLDivElement>();

    const { data: machinesData } = useQuery<{ machines: Machine[] }>({
        queryKey: QUERY_KEYS.machines,
        queryFn: async () => {
            const response = await throwIfNotOk(await apiFetch('/machines/'), '/machines/');
            return response.json();
        },
    });

    const machines = machinesData?.machines || [];

    useMemo(() => {
        if (!selectedDeviceId && machines.length > 0) {
            setSelectedDeviceId(machines[0].id);
        }
    }, [machines, selectedDeviceId]);

    const selectedMachine = machines.find(m => m.id === selectedDeviceId);
    const reportCopy = mockScenario.report;

    const { data: latestReport, isLoading: isReportLoading } = useQuery<DailyReport>({
        queryKey: QUERY_KEYS.reportsLatest(selectedDeviceId),
        queryFn: async () => {
            if (!selectedDeviceId) return null;
            const response = await apiFetch(`/reports/latest/${selectedDeviceId}`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error('리포트 로드 실패');
            }
            return response.json();
        },
        enabled: !!selectedDeviceId,
    });

    const { data: historyData } = useQuery<{ reports: DailyReport[] }>({
        queryKey: QUERY_KEYS.reportsTrend(selectedDeviceId),
        queryFn: async () => {
            if (!selectedDeviceId) return { reports: [] };
            const response = await apiFetch(`/reports/?device_id=${selectedDeviceId}`);
            if (response.status === 404) return { reports: [] };
            await throwIfNotOk(response, '/reports/');
            return response.json();
        },
        enabled: !!selectedDeviceId,
    });

    const trendData = useMemo(() => {
        if (!historyData?.reports) return [];
        return [...historyData.reports]
            .reverse()
            .slice(-7)
            .map(r => ({
                day: new Date(r.report_date).toLocaleDateString('ko-KR', { weekday: 'short' }),
                health: r.health_score
            }));
    }, [historyData]);

    const formattedDate = latestReport
        ? new Date(latestReport.report_date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
        : '리포트 없음';

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-slate-50">
            <Header />
            <main className="flex-1 overflow-y-auto px-5 pt-6 space-y-8">
                ... (전체 JSX 생략)
            </main>
            <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} reportDate={formattedDate} />
            <BottomNav />
        </div>
    );
}
*/
