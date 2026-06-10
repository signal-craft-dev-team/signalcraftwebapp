import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Sparkles, Clock, BarChart3 } from 'lucide-react';
import { Button } from '../../ui/Button';

interface SubscriptionDetailProps {
    onBack: () => void;
}

export function SubscriptionDetail({ onBack }: SubscriptionDetailProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col h-full"
        >
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium text-sm mb-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue"
                style={{ borderRadius: 'var(--radius-sm)' }}
            >
                <ChevronLeft size={18} />
                계정으로 돌아가기
            </button>

            <div className="flex-1 space-y-6">
                {/* Current Plan Card */}
                <div className="p-6 bg-slate-900 text-white relative overflow-hidden shadow-lg" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-signal-blue rounded-full text-[10px] font-semibold uppercase">Active</span>
                            <span className="section-label text-slate-400 mb-0">Premium Plan</span>
                        </div>
                        <h4 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>PRO 멤버십</h4>
                        <p className="text-slate-400 text-sm font-medium mb-6">모든 AI 정밀 분석 기능을 사용 중입니다</p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm font-medium">
                                <Clock size={16} className="text-signal-blue" />
                                <span>다음 결제일: 2026년 2월 21일</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium">
                                <CreditCard size={16} className="text-signal-blue" />
                                <span>결제 수단: 현대카드 (**** 1234)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage Stats */}
                <div className="space-y-4">
                    <h5 className="text-sm font-bold text-slate-900 px-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        <BarChart3 size={16} className="text-signal-blue" />
                        이번 달 사용량
                    </h5>
                    <div className="p-6 bg-slate-50 border border-slate-100" style={{ borderRadius: 'var(--radius-lg)' }}>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-slate-500">AI 정밀 소리 분석</span>
                            <span className="text-sm font-bold text-slate-900">142 / 500회</span>
                        </div>
                        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '28%' }}
                                className="h-full bg-signal-blue rounded-full"
                            />
                        </div>
                        <p className="mt-4 text-xs text-slate-400 font-medium leading-relaxed break-keep">
                            PRO 플랜은 매달 500회의 정밀 분석을 제공합니다. (현재 28% 사용 중)
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-3">
                <Button className="w-full h-14 font-semibold" style={{ borderRadius: 'var(--radius-md)' }}>구독 플랜 변경</Button>
                <Button variant="secondary" className="w-full h-14 font-medium text-rose-500 border-none hover:bg-rose-50 bg-slate-50" style={{ borderRadius: 'var(--radius-md)' }}>구독 해지 예약</Button>
            </div>
        </motion.div>
    );
}
