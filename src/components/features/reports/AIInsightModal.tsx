import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Zap, Brain } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { chartTokens } from '@/styles/tokens';
import { mockScenario } from '@/lib/mockScenario';

interface AIInsightModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Period = keyof typeof mockScenario.aiInsight.periodData;

export function AIInsightModal({ isOpen, onClose }: AIInsightModalProps) {
    const [period, setPeriod] = useState<Period>('daily');

    const periods = mockScenario.aiInsight.periods;
    const data = mockScenario.aiInsight.periodData[period];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 z-[100]"
                        style={{ backdropFilter: 'blur(4px)' }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 16 }}
                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed inset-x-4 top-[10%] bottom-[10%] max-w-lg mx-auto bg-white shadow-2xl z-[101] overflow-hidden flex flex-col"
                        style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                        {/* Header */}
                        <div className="bg-slate-50 border-b border-slate-100 p-6 pb-0">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-signal-blue">
                                    <Brain size={24} />
                                    <h2 className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>AI Insight Analysis</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="size-8 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue"
                                    aria-label="닫기"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex p-1 bg-slate-200/50 mb-6" style={{ borderRadius: 'var(--radius-md)' }}>
                                {periods.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPeriod(p.id as Period)}
                                        className={cn(
                                            "flex-1 py-2.5 text-sm font-medium transition-all",
                                            period === p.id
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                        )}
                                        style={{ borderRadius: 'calc(var(--radius-md) - 4px)' }}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {data ? (
                                <>
                                    {/* Summary Section */}
                                    <section className="text-center space-y-2">
                                        <div className="inline-flex items-center justify-center size-24 rounded-full bg-signal-blue/5 mb-2 relative">
                                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke={chartTokens.gridMajor}
                                                    strokeWidth="3"
                                                />
                                                <motion.path
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: data.score / 100 }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke={chartTokens.primaryStroke}
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                                <span className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>{data.score}</span>
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase">Score</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>{data.status}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed">{data.summary}</p>
                                    </section>

                                    {/* Metrics Grid */}
                                    <section className="grid grid-cols-3 gap-3">
                                        {data.metrics.map((metric, idx) => (
                                            <div key={idx} className="bg-slate-50 p-3 text-center border border-slate-100" style={{ borderRadius: 'var(--radius-md)' }}>
                                                <p className="text-[11px] font-medium text-slate-400 mb-1">{metric.label}</p>
                                                <p className="text-base font-bold text-slate-900 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{metric.value}</p>
                                                <p className={cn(
                                                    "text-[10px] font-medium",
                                                    metric.isGood ? "text-emerald-500" : "text-rose-500"
                                                )}>
                                                    {metric.change}
                                                </p>
                                            </div>
                                        ))}
                                    </section>

                                    {/* Timeline */}
                                    <section>
                                        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                            <Calendar size={16} className="text-slate-400" />
                                            주요 이벤트
                                        </h4>
                                        <div className="space-y-4 pl-2 border-l-2 border-slate-100 ml-2">
                                            {data.timeline.map((item, idx) => (
                                                <div key={idx} className="relative pl-6">
                                                    <div className={cn(
                                                        "absolute -left-[9px] top-1.5 size-4 rounded-full border-2 border-white shadow-sm",
                                                        item.type === 'info' ? "bg-slate-300" :
                                                            item.type === 'warning' ? "bg-amber-400" :
                                                                item.type === 'alert' ? "bg-rose-500" : "bg-emerald-500"
                                                    )} />
                                                    <p className="text-xs font-medium text-slate-400 mb-0.5">{item.time}</p>
                                                    <p className="text-sm font-medium text-slate-700">{item.event}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* AI Advice */}
                                    <section className="bg-gradient-to-br from-signal-blue to-indigo-600 p-6 text-white relative overflow-hidden"
                                        style={{ borderRadius: 'var(--radius-lg)' }}
                                    >
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-3 opacity-90">
                                                <Zap size={16} />
                                                <span className="section-label text-white/80 mb-0">AI Action Item</span>
                                            </div>
                                            <p className="text-lg font-medium leading-relaxed opacity-95">
                                                "{data.aiAdvice}"
                                            </p>
                                        </div>
                                    </section>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-10 space-y-4 text-center"
                                >
                                    <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center">
                                        <Brain size={32} className="text-slate-300" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>데이터가 부족합니다</h3>
                                        <p className="text-sm text-slate-500 font-medium">
                                            아직 충분한 데이터가 수집되지 않았습니다.<br />
                                            조금 더 설비를 가동한 후 다시 확인해주세요.
                                        </p>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-50 text-xs font-medium text-slate-400 border border-slate-100 mt-4"
                                        style={{ borderRadius: 'var(--radius-sm)' }}
                                    >
                                        Tip: 정확한 분석을 위해 최소 24시간의 가동 데이터가 필요합니다.
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
