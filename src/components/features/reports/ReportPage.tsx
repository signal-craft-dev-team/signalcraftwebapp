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
            // 신 staging에 /reports/ 미제공 시 빈 trend로 silent 폴백
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
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-slate-900 tracking-tight">
                        {viewMode === 'report' ? "오늘의 리포트" : "히스토리"}
                    </h2>
                    <button
                        onClick={() => setIsShareOpen(true)}
                        className="p-3 bg-white border border-slate-100 shadow-card text-signal-blue active:scale-[0.95] transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                        style={{ borderRadius: 'var(--radius-md)' }}
                        aria-label="리포트 공유"
                    >
                        <Share2 size={20} />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {viewMode === 'report' ? (
                        <motion.div
                            key="report-content"
                            id="report-content"
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16 }}
                            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                            className="space-y-8 p-1"
                        >
                            {/* Date Selector & Device Selector */}
                            <section className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="section-label mb-1">Daily Report</p>
                                        <h1 className="text-slate-900 tracking-tighter">{formattedDate}</h1>
                                    </div>
                                    <span className="text-sm text-slate-300 font-medium mb-1">2026</span>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setIsDeviceMenuOpen(!isDeviceMenuOpen)}
                                        className="flex items-center gap-2 bg-white px-5 py-3 border border-slate-100 active:scale-[0.98] transition-all shadow-card w-full font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue"
                                        style={{ borderRadius: 'var(--radius-md)' }}
                                    >
                                        <span className="text-signal-blue flex-1 text-left">{selectedMachine?.name || '설비 선택'}</span>
                                        <ChevronDown size={18} className={cn("text-slate-400 transition-transform", isDeviceMenuOpen && "rotate-180")}
                                            style={{ transitionDuration: 'var(--duration-normal)' }}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isDeviceMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg border border-slate-100 py-2 z-50 max-h-48 overflow-y-auto"
                                                style={{ borderRadius: 'var(--radius-md)' }}
                                            >
                                                {machines.map(m => (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => {
                                                            setSelectedDeviceId(m.id);
                                                            setIsDeviceMenuOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full px-5 py-3 text-left font-medium hover:bg-slate-50 transition-colors",
                                                            selectedDeviceId === m.id ? "text-signal-blue" : "text-slate-600"
                                                        )}
                                                    >
                                                        {m.name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </section>

                            {isReportLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                                    <Loader2 className="size-8 animate-spin" />
                                    <p className="font-medium">데이터를 분석하고 있습니다...</p>
                                </div>
                            ) : !latestReport ? (
                                <div className="py-20 text-center bg-white border border-dashed border-slate-200" style={{ borderRadius: 'var(--radius-lg)' }}>
                                    <p className="font-medium text-slate-400">최근 리포트 데이터가 없습니다.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Weekly Trend Chart */}
                                    <section className="space-y-4">
                                        <h3 className="section-label flex items-center gap-2">
                                            <TrendingUp size={18} className="text-signal-blue" />
                                            주간 건강 트렌드
                                        </h3>
                                        <div ref={trendChartRef} className="h-48 w-full p-4 bg-white border border-slate-100 shadow-card" style={{ borderRadius: 'var(--radius-lg)' }}>
                                            {trendData.length > 0 && trendChartSize.width > 1 && trendChartSize.height > 1 ? (
                                                    <AreaChart data={trendData} width={trendChartSize.width} height={trendChartSize.height}>
                                                        <defs>
                                                            <linearGradient id="reportTrend" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor={chartTokens.primaryFill} stopOpacity={0.1} />
                                                                <stop offset="95%" stopColor={chartTokens.primaryFill} stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: effects.softShadow as string }}
                                                            labelStyle={{ fontWeight: 700 }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="health"
                                                            stroke={chartTokens.primaryStroke}
                                                            strokeWidth={3}
                                                            fillOpacity={1}
                                                            fill="url(#reportTrend)"
                                                        />
                                                    </AreaChart>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-slate-300 font-medium">트렌드 데이터 부족</div>
                                            )}
                                        </div>
                                    </section>

                                    {/* Executive Summary */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                                        className={cn(
                                            "relative overflow-hidden p-6 border",
                                            getHaccpStatusClass(latestReport.haccp_status).summary
                                        )}
                                        style={{ borderRadius: 'var(--radius-lg)' }}
                                    >
                                        <div className={cn(
                                            "absolute top-0 left-0 w-1 h-full",
                                            getHaccpStatusClass(latestReport.haccp_status).stripe
                                        )} />
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "flex size-14 shrink-0 items-center justify-center shadow-sm",
                                                getHaccpStatusClass(latestReport.haccp_status).icon
                                            )} style={{ borderRadius: 'var(--radius-md)' }}>
                                                {latestReport.haccp_status === 'PASS' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className={cn(
                                                    "section-label mb-0",
                                                    getHaccpStatusClass(latestReport.haccp_status).label
                                                )}>상태 요약</h3>
                                                <p className="text-xl font-bold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                                                    {reportCopy.statusSummary[latestReport.haccp_status as keyof typeof reportCopy.statusSummary]}
                                                </p>
                                                <p className="text-sm text-slate-500 font-medium">{latestReport.ai_summary}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Energy Insight Card */}
                                    <section className="p-6 bg-slate-900 text-white relative overflow-hidden shadow-lg"
                                        style={{ borderRadius: 'var(--radius-lg)' }}
                                    >
                                        <div className="absolute -right-4 -top-4 opacity-10">
                                            <Zap size={100} />
                                        </div>
                                        <div className="relative z-10 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="section-label text-slate-400 mb-0">{reportCopy.energy.label}</p>
                                                <h4 className="text-xl font-bold italic" style={{ fontFamily: 'var(--font-heading)' }}>
                                                    {latestReport.roi_data.saved > 0 ? reportCopy.energy.activeTitle(latestReport.roi_data.saved) : reportCopy.energy.inactiveTitle}
                                                </h4>
                                                <p className="text-sm text-slate-400 font-medium">{reportCopy.energy.description}</p>
                                            </div>
                                            <div className="size-12 bg-white/10 flex items-center justify-center" style={{ borderRadius: 'var(--radius-md)' }}>
                                                <Zap size={24} className="text-amber-400" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Statistics Section */}
                                    <section className="space-y-4">
                                        <h3 className="section-label flex items-center gap-2">
                                            <div className="size-2 bg-signal-blue rounded-full" />
                                            핵심 통계
                                        </h3>
                                        <div className="divide-y divide-slate-50 border border-slate-100 px-6 bg-white shadow-card"
                                            style={{ borderRadius: 'var(--radius-lg)' }}
                                        >
                                            <StatRow
                                                label={reportCopy.stats.runtimeLabel}
                                                value={`${Math.floor(latestReport.total_runtime / 60)}시간 ${latestReport.total_runtime % 60}분`}
                                                status="Normal"
                                                progress={Math.min(100, (latestReport.total_runtime / 1440) * 100)}
                                            />
                                            <StatRow
                                                label={reportCopy.stats.cycleLabel}
                                                value={`${latestReport.cycle_count}${reportCopy.stats.cycleUnit}`}
                                                status={latestReport.cycle_count > 20 ? "Warning" : "Optimal"}
                                                progress={Math.min(100, (latestReport.cycle_count / 30) * 100)}
                                                color={latestReport.cycle_count > 20 ? classTokens.statProgress.warning : classTokens.statProgress.healthy}
                                            />
                                        </div>
                                    </section>

                                    <AIInsightCard />
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <HistoryView
                            deviceId={selectedDeviceId}
                            onSelectDate={() => {
                                setViewMode('report');
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="flex gap-3 pt-4 sticky bottom-5 z-30 pb-4">
                    <Button
                        variant="secondary"
                        onClick={() => setViewMode(viewMode === 'report' ? 'history' : 'report')}
                        className="flex-1 py-4 bg-white/80 border border-slate-100 shadow-lg"
                        style={{ backdropFilter: 'blur(12px)' }}
                    >
                        {viewMode === 'report' ? (
                            <>
                                <History size={18} />
                                히스토리
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={18} />
                                현재 리포트
                            </>
                        )}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsShareOpen(true)}
                        className="flex-1 py-4 shadow-lg"
                    >
                        <Share2 size={18} />
                        공유하기
                    </Button>
                </div>
            </main>

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                reportDate={formattedDate}
            />

            <BottomNav />
        </div>
    );
}
