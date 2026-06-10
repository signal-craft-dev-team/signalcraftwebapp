import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X } from 'lucide-react';
import { classTokens, cssVars } from '@/styles/tokens';
import { cn } from '@/lib/utils';

interface MaintenanceCallButtonProps {
    phone: string;
}

function useIsDesktop(): boolean {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const query = window.matchMedia('(hover: hover) and (pointer: fine)');
        const update = () => setIsDesktop(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

    return isDesktop;
}

export function MaintenanceCallButton({ phone }: MaintenanceCallButtonProps) {
    const isDesktop = useIsDesktop();
    const [isPopupOpen, setPopupOpen] = useState(false);

    const buttonClass = cn(
        'inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        classTokens.button.primary,
    );

    return (
        <>
            {isDesktop ? (
                <button
                    type="button"
                    onClick={() => setPopupOpen(true)}
                    className={buttonClass}
                    style={{ borderRadius: cssVars.radiusMd, fontFamily: cssVars.fontHeading }}
                >
                    <Phone className="size-4" />
                    정비사 전화하기
                </button>
            ) : (
                <a
                    href={`tel:${phone}`}
                    className={buttonClass}
                    style={{ borderRadius: cssVars.radiusMd, fontFamily: cssVars.fontHeading }}
                >
                    <Phone className="size-4" />
                    정비사 전화하기
                </a>
            )}

            <AnimatePresence>
                {isPopupOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPopupOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 z-[100]"
                            style={{ backdropFilter: 'blur(4px)' }}
                        />
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label="정비사 연락처"
                            initial={{ opacity: 0, scale: 0.97, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 16 }}
                            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-xs mx-auto bg-card shadow-2xl z-[101] p-6 text-center"
                            style={{ borderRadius: cssVars.radiusLg }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <p className={cn('text-xs font-semibold uppercase', classTokens.text.muted)}>
                                    정비사 연락처
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setPopupOpen(false)}
                                    aria-label="연락처 닫기"
                                    className={cn(
                                        'size-7 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                        classTokens.text.muted,
                                        classTokens.hover.subtle,
                                    )}
                                    style={{ borderRadius: cssVars.radiusSm }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <p
                                className={cn('text-3xl font-bold my-4', classTokens.text.brand)}
                                style={{ fontFamily: cssVars.fontHeading }}
                            >
                                {phone}
                            </p>
                            <a
                                href={`tel:${phone}`}
                                className={cn(
                                    'inline-flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold transition-all',
                                    classTokens.button.primary,
                                )}
                                style={{ borderRadius: cssVars.radiusMd }}
                            >
                                <Phone className="size-4" />
                                바로 전화하기
                            </a>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
