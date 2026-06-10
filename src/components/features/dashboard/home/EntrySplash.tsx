import { useEffect } from 'react';
import { motion } from 'framer-motion';
import signalCraftLogo from '@/assets/signalcraft-logo.png';
import { classTokens, cssVars } from '@/styles/tokens';
import { cn } from '@/lib/utils';

interface EntrySplashProps {
    version: string;
    onClose: () => void;
    autoDismissMs?: number;
}

export function EntrySplash({ version, onClose, autoDismissMs = 2500 }: EntrySplashProps) {
    useEffect(() => {
        const timer = window.setTimeout(onClose, autoDismissMs);
        return () => window.clearTimeout(timer);
    }, [onClose, autoDismissMs]);

    return (
        <motion.div
            role="dialog"
            aria-label="SignalCraft 진입 화면"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            onClick={onClose}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background cursor-pointer"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                className="flex flex-col items-center gap-5"
            >
                <img
                    src={signalCraftLogo}
                    alt="SignalCraft"
                    className="size-20 select-none"
                    draggable={false}
                />
                <div className="flex flex-col items-center gap-1">
                    <h1
                        className={cn('text-2xl font-bold', classTokens.text.primary)}
                        style={{ fontFamily: cssVars.fontHeading }}
                    >
                        SignalCraft
                    </h1>
                    <p className={cn('text-xs font-medium', classTokens.text.muted)}>
                        무설정 AI 시설 관리
                    </p>
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className={cn('absolute bottom-10 text-[11px] font-semibold uppercase', classTokens.text.muted)}
            >
                {version}
            </motion.p>
        </motion.div>
    );
}
