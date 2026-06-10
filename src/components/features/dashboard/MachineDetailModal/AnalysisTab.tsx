import { motion } from 'framer-motion';
import { Activity, Volume2, ShieldCheck, Zap, AlertCircle, Settings2, TrendingDown, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { type Machine } from '../MachineCard';
import { cn } from '../../../../lib/utils';
import { apiFetch } from '@/lib/api';
import { throwIfNotOk, getEndpointPendingMode } from '@/lib/apiErrorHelper';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { chartTokens, classTokens, statusTokens } from '@/styles/tokens';
import { useElementSize } from '@/lib/useElementSize';
import { mockScenario } from '@/lib/mockScenario';
import { EndpointPending } from '../../../shared/EndpointPending';

interface AnalysisTabProps {
    machine: Machine;
    onViewMaintenance: () => void;
}

export function AnalysisTab({ machine, onViewMaintenance }: AnalysisTabProps) {
    const [forecastChartRef, forecastChartSize] = useElementSize<HTMLDivElement>();

    const { data: analysis, isPending, error } = useQuery({
        queryKey: QUERY_KEYS.machineAnalysis(machine.id),
        queryFn: async () => {
            const response = await throwIfNotOk(
                await apiFetch(`/dashboard/machine-detail/analysis?machine_id=${machine.id}`),
                '/dashboard/machine-detail/analysis'
            );
            return response.json();
        },
    });

    if (isPending) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="size-8 text-signal-blue animate-spin" />
                <p className="text-slate-400 font-medium text-sm">기계 상태를 분석하고 있습니다...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-6">
                <EndpointPending
                    title="분석 데이터를 준비 중이에요"
                    description="AI 분석 결과를 정리하고 있어요. 잠시 후 다시 시도해 주세요."
                    icon={TrendingDown}
                    mode={getEndpointPendingMode(error)}
                />
            </div>
        );
    }

    const report = analysis?.report;
    const forecast = analysis?.forecast;

    const health = report?.health_score ?? machine.health;
    const diagnostics = report?.diagnostics || { comp: 98, fan: 85, valve: 92 };
    const roi = report?.roi_data || { watt: 42.5, door_opens: 12 };
    const machineStatusClass = classTokens.machineStatus[machine.status];
    const analysisCopy = mockScenario.analysis;

    const forecastData = forecast?.prediction_data ?
        (typeof forecast.prediction_data === 'string' ? JSON.parse(forecast.prediction_data) : forecast.prediction_data)
        : [
            { time: '현재', value: health },
            { time: '1일 뒤', value: Math.max(0, health - 5) },
            { time: '2일 뒤', value: Math.max(0, health - 12) },
            { time: '3일 뒤', value: Math.max(0, health - 20) },
        ];
    const gaugeGradient = statusTokens[machine.status];

    return (
        <motion.div
            key="analysis"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-8 pb-10"
        >
            {/* Health Score Hero */}
            <section className="relative">
                <div className="flex flex-col items-center justify-center py-6 px-4 bg-white border border-slate-100 shadow-card overflow-hidden relative"
                    style={{ borderRadius: 'var(--radius-lg)' }}
                >
                    <div className="relative size-64 flex items-center justify-center mb-6">
                        <svg className="size-full" viewBox="0 0 240 240">
                            <defs>
                                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor={gaugeGradient.gradientStart} />
                                    <stop offset="100%" stopColor={gaugeGradient.gradientEnd} />
                                </linearGradient>
                            </defs>

                            {Array.from({ length: 40 }).map((_, i) => {
                                const angle = (i / 40) * 360;
                                const isMajor = i % 5 === 0;
                                return (
                                    <line
                                        key={i}
                                        x1="120" y1="20" x2="120" y2={isMajor ? "35" : "28"}
                                        stroke={isMajor ? chartTokens.gridMajor : chartTokens.grid}
                                        strokeWidth={isMajor ? "2" : "1"}
                                        transform={`rotate(${angle} 120 120)`}
                                    />
                                );
                            })}

                            <circle cx="120" cy="120" r="88" fill="none" stroke={chartTokens.surface} strokeWidth="16" strokeLinecap="round" />

                            <motion.circle
                                cx="120" cy="120" r="88" fill="none" stroke="url(#gaugeGradient)"
                                strokeWidth="16" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 88}
                                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                animate={{ strokeDashoffset: (2 * Math.PI * 88) * (1 - health / 100) }}
                                transition={{ type: "spring", stiffness: 60, damping: 15, mass: 1 }}
                                transform="rotate(-90 120 120)"
                            />

                            <circle cx="120" cy="120" r="70" fill="none" stroke={chartTokens.grid} strokeWidth="1" strokeDasharray="4 4" />
                        </svg>

                        <div className="absolute flex flex-col items-center">
                            <span className="section-label mb-1">Health</span>
                            <div className="flex items-baseline">
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                    className="text-6xl font-bold text-slate-900 tracking-tighter"
                                    style={{ fontFamily: 'var(--font-heading)' }}
                                >
                                    {health}
                                </motion.span>
                                <span className="text-xl font-medium text-slate-300 ml-1">%</span>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-[11px] font-medium",
                                machineStatusClass.badge
                            )}>
                                <div className={cn(
                                    "size-1.5 rounded-full",
                                    machineStatusClass.dot
                                )} />
                                {machine.status === 'running' ? 'Optimal' : machine.status === 'warning' ? 'Check Required' : 'Critical'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Semantic Diagnostics */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        <Settings2 size={20} className="text-slate-400" />
                        {analysisCopy.diagnosticsTitle}
                    </h3>
                    <span className="section-label mb-0 bg-slate-100 px-2 py-1" style={{ borderRadius: '6px' }}>AI 분석</span>
                </div>
                <div className="p-6 bg-white border border-slate-100 grid gap-6" style={{ borderRadius: 'var(--radius-lg)' }}>
                    {analysisCopy.diagnostics.map((part, i) => {
                        const score = diagnostics[part.key] || 90;
                        return (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-sm font-semibold text-slate-700">{part.label}</div>
                                    <div className="text-[11px] font-medium text-slate-400">{score > 80 ? part.goodDetail : part.warnDetail}</div>
                                </div>
                                <div className="text-sm font-bold text-slate-900">{score}%</div>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${score}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                                    className={cn(
                                        "h-full rounded-full",
                                        score > 90 ? classTokens.componentScore.good : score > 80 ? classTokens.componentScore.warning : classTokens.componentScore.danger
                                    )}
                                />
                            </div>
                        </div>
                    )})}
                </div>
            </section>

            {/* Sound Spectrum Visualizer */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        <Volume2 size={20} className="text-signal-blue" />
                        {analysisCopy.liveSignalTitle}
                    </h3>
                    <span className="section-label mb-0">Active Listening</span>
                </div>
                <div className="h-40 flex items-end gap-1.5 px-4 py-8 bg-slate-900 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                    {[...Array(32)].map((_, i) => {
                        const healthThreshold = (health / 100) * 32;
                        const isHealthy = i < healthThreshold;
                        const alertColor = health < 50 ? "bg-signal-red" : "bg-signal-orange";

                        return (
                            <motion.div
                                key={i}
                                initial={{ height: 10 }}
                                animate={{
                                    height: [
                                        Math.random() * 60 + 20,
                                        Math.random() * 80 + 20,
                                        Math.random() * 40 + 20
                                    ]
                                }}
                                transition={{
                                    duration: 0.5 + Math.random(),
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                className={cn(
                                    "flex-1 rounded-t-full transition-colors",
                                    isHealthy ? "bg-signal-blue" : alertColor
                                )}
                            />
                        );
                    })}
                </div>
            </section>

            {/* Predictive Engine (72H Forecast) */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        <TrendingDown size={20} className="text-signal-red" />
                        {analysisCopy.forecastTitle}
                    </h3>
                    {health < 80 && (
                        <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full", classTokens.bg.dangerSoft)}>
                            <span className={cn("size-2 rounded-full", classTokens.healthForecast.dangerDot)} />
                            <span className={cn("section-label mb-0", classTokens.healthForecast.dangerText)}>점검 권장</span>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white border border-slate-100 shadow-card space-y-6" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <div ref={forecastChartRef} className="h-[200px] w-full">
                        {forecastChartSize.width > 1 && forecastChartSize.height > 1 ? (
                                <AreaChart data={forecastData} width={forecastChartSize.width} height={forecastChartSize.height}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={chartTokens.primaryFill} stopOpacity={0.1} />
                                            <stop offset="95%" stopColor={chartTokens.primaryFill} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTokens.grid} />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: chartTokens.axisTick, fontSize: 10, fontWeight: 500 }} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-slate-900 text-white px-3 py-2 text-xs font-medium border border-slate-800 shadow-xl"
                                                        style={{ borderRadius: 'var(--radius-sm)' }}
                                                    >
                                                        <p className="opacity-60 mb-1">{data.time}</p>
                                                        <p className="text-sm">{analysisCopy.forecastValueLabel}: {data.value}%</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke={chartTokens.primaryStroke} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                        ) : null}
                    </div>

                    <div className={cn(
                        "flex items-center justify-between p-5 border",
                        health < 80 ? classTokens.healthForecast.dangerCard : classTokens.healthForecast.healthyCard
                    )} style={{ borderRadius: 'var(--radius-md)' }}>
                        {forecast?.golden_time ? (
                            <div>
                                <div className={cn("section-label mb-0.5", health < 80 ? classTokens.healthForecast.dangerMuted : classTokens.healthForecast.healthyMuted)}>{analysisCopy.forecastFailureLabel}</div>
                                <div className={cn("text-2xl font-bold tracking-tighter", health < 80 ? classTokens.healthForecast.dangerText : classTokens.healthForecast.healthyText)}
                                    style={{ fontFamily: 'var(--font-heading)' }}
                                >
                                    {new Date(forecast.golden_time).toLocaleDateString()}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="section-label text-emerald-400 mb-0.5">{analysisCopy.forecastHealthyLabel}</div>
                                <div className="text-2xl font-bold text-emerald-600 tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>{analysisCopy.forecastHealthyValue}</div>
                            </div>
                        )}
                        <div className="text-right">
                            <div className={cn("section-label mb-0.5", health < 80 ? classTokens.healthForecast.dangerMuted : classTokens.healthForecast.healthyMuted)}>예측 정확도</div>
                            <div className={cn("text-sm font-semibold", health < 80 ? classTokens.healthForecast.dangerSmall : classTokens.healthForecast.healthySmall)}>85% (매우 높음)</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Virtual ROI & Smart Sensors */}
            <section className="space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    <Zap size={20} className="text-amber-500" />
                    {analysisCopy.efficiencyTitle}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 border border-slate-100 relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 text-amber-600" style={{ borderRadius: 'var(--radius-sm)' }}>
                                <Activity size={18} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{analysisCopy.primaryMetricLabel}</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>{roi.watt || 0}</span>
                            <span className="text-sm font-medium text-slate-400">kWh</span>
                        </div>
                        <p className="text-xs font-medium text-emerald-500">{analysisCopy.primaryMetricDescription(roi.saved || 0)}</p>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-100 relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600" style={{ borderRadius: 'var(--radius-sm)' }}>
                                <ShieldCheck size={18} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{analysisCopy.secondaryMetricLabel}</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>{roi.door_opens || 0}</span>
                            <span className="text-sm font-medium text-slate-400">{analysisCopy.secondaryMetricUnit}</span>
                        </div>
                        <p className="text-xs font-medium text-amber-500">{analysisCopy.secondaryMetricDescription}</p>
                    </div>
                </div>
            </section>

            {/* AI Insights Card */}
            <section>
                <div className="p-6 bg-signal-blue text-white shadow-lg relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-white/20" style={{ borderRadius: 'var(--radius-sm)' }}>
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-sm font-semibold tracking-wide">{analysisCopy.insightLabel}</span>
                        </div>
                        <p className="text-lg font-medium leading-snug tracking-tight break-keep">
                            {report?.ai_summary || machine.prediction}
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={14} className="text-blue-100" />
                                <span className="text-xs font-medium text-blue-100">최근 업데이트: {report ? new Date(report.created_at).toLocaleTimeString() : '방금 전'}</span>
                            </div>
                            <button
                                onClick={onViewMaintenance}
                                className="text-xs font-semibold px-4 py-2 bg-white text-signal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                style={{ borderRadius: 'var(--radius-sm)' }}
                            >
                                유지보수 기록
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
