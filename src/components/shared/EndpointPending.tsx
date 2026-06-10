import { motion } from 'framer-motion';
import { AlertCircle, Clock, type LucideIcon } from 'lucide-react';
import { classTokens } from '@/styles/tokens';
import type { EndpointPendingMode } from '@/lib/apiErrorHelper';

type EndpointPendingProps = {
    title: string;
    description?: string;
    icon?: LucideIcon;
    mode?: EndpointPendingMode;
    className?: string;
};

const MODE_STYLES: Record<EndpointPendingMode, {
    bg: string;
    border: string;
    text: string;
    iconWrap: string;
    iconColor: string;
    fallbackIcon: LucideIcon;
    role: 'status' | 'alert';
}> = {
    preparing: {
        bg: classTokens.bg.infoSoft,
        border: classTokens.border.infoSoft,
        text: classTokens.text.info,
        iconWrap: 'bg-blue-100',
        iconColor: classTokens.text.infoIcon,
        fallbackIcon: Clock,
        role: 'status',
    },
    empty: {
        bg: classTokens.bg.muted,
        border: classTokens.border.muted,
        text: classTokens.text.muted,
        iconWrap: 'bg-slate-100',
        iconColor: classTokens.text.subtle,
        fallbackIcon: Clock,
        role: 'status',
    },
    error: {
        bg: classTokens.bg.dangerSoft,
        border: classTokens.border.dangerSoft,
        text: classTokens.text.danger,
        iconWrap: 'bg-rose-100',
        iconColor: classTokens.text.dangerIcon,
        fallbackIcon: AlertCircle,
        role: 'alert',
    },
};

const cx = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(' ');

export function EndpointPending({
    title,
    description,
    icon,
    mode = 'preparing',
    className,
}: EndpointPendingProps) {
    const styles = MODE_STYLES[mode];
    const Icon = icon ?? styles.fallbackIcon;

    return (
        <motion.div
            role={styles.role}
            aria-live={styles.role === 'alert' ? 'assertive' : 'polite'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cx(
                'flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center',
                styles.bg,
                styles.border,
                className
            )}
        >
            <span
                aria-hidden="true"
                className={cx(
                    'flex h-12 w-12 items-center justify-center rounded-full',
                    styles.iconWrap
                )}
            >
                <Icon className={cx('h-6 w-6', styles.iconColor)} />
            </span>
            <div className="flex flex-col gap-1">
                <p className={cx('text-base font-semibold', styles.text)}>{title}</p>
                {description ? (
                    <p className={cx('text-sm', classTokens.text.muted)}>{description}</p>
                ) : null}
            </div>
        </motion.div>
    );
}
