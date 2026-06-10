import { motion } from 'framer-motion';
import { ChevronLeft, Bell, Globe } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface AppSettingsProps {
    onBack: () => void;
}

export function AppSettings({ onBack }: AppSettingsProps) {
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
                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium text-sm mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue"
                style={{ borderRadius: 'var(--radius-sm)' }}
            >
                <ChevronLeft size={18} />
                계정으로 돌아가기
            </button>

            <div className="space-y-10">
                {/* Notification Toggles */}
                <section className="space-y-4">
                    <h5 className="flex items-center gap-2 text-sm font-bold text-slate-900 px-2 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        <Bell size={18} className="text-slate-400" />
                        푸시 알림 관리
                    </h5>
                    <div className="space-y-3">
                        {[
                            { label: '설비 이상 감지 알림', active: true },
                            { label: '일간 리포트 요약 알림', active: true },
                            { label: '유지보수 일정 리마인드', active: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-50 hover:bg-slate-50 transition-all"
                                style={{ borderRadius: 'var(--radius-md)' }}
                            >
                                <span className="text-base font-semibold text-slate-700">{item.label}</span>
                                <div className={cn(
                                    "w-12 h-6 rounded-full p-1 transition-colors relative",
                                    item.active ? "bg-signal-blue" : "bg-slate-200"
                                )} style={{ transitionDuration: 'var(--duration-normal)' }}>
                                    <div className={cn(
                                        "size-4 bg-white rounded-full transition-transform shadow-sm",
                                        item.active ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Language Selection */}
                <section className="space-y-4">
                    <h5 className="flex items-center gap-2 text-sm font-bold text-slate-900 px-2 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        <Globe size={18} className="text-slate-400" />
                        언어 설정 (Language)
                    </h5>
                    <button className="w-full flex items-center justify-between p-5 bg-white border border-slate-50 hover:bg-slate-50 transition-all active:scale-[0.98] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                        style={{ borderRadius: 'var(--radius-md)' }}
                    >
                        <span className="text-base font-semibold text-slate-700">한국어 (Korean)</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-400">변경 가능</span>
                            <ChevronLeft size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors rotate-180" />
                        </div>
                    </button>
                </section>
            </div>
        </motion.div>
    );
}
