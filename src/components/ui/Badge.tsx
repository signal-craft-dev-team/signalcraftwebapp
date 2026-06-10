import React from 'react';
import { cn } from '../../lib/utils';
import { classTokens } from '@/styles/tokens';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    children: React.ReactNode;
}

export function Badge({ children, className, variant = 'neutral', ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border uppercase tracking-wider",
                `rounded-[${String('var(--radius-sm)')}]`,
                classTokens.badge[variant],
                className
            )}
            style={{ borderRadius: 'var(--radius-sm)' }}
            {...props}
        >
            <span className={cn("size-1.5 rounded-full", classTokens.badgeDot[variant])} />
            {children}
        </span>
    );
}
