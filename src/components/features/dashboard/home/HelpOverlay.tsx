import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { classTokens, cssVars } from '@/styles/tokens';
import { cn } from '@/lib/utils';

interface HelpOverlayProps {
    isOpen: boolean;
    title: string;
    description: string;
    onClose: () => void;
}

export function HelpOverlay({ isOpen, title, description, onClose }: HelpOverlayProps) {
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
                        role="dialog"
                        aria-modal="true"
                        aria-label={title}
                        initial={{ opacity: 0, scale: 0.97, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 16 }}
                        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-card shadow-2xl z-[101] p-6"
                        style={{ borderRadius: cssVars.radiusLg }}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h2
                                className={cn('text-base font-bold', classTokens.text.primary)}
                                style={{ fontFamily: cssVars.fontHeading }}
                            >
                                {title}
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="도움말 닫기"
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
                        <p className={cn('text-sm font-medium leading-relaxed whitespace-pre-line', classTokens.text.secondary)}>
                            {description}
                        </p>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
