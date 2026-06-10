import React from 'react';
import { cn } from '../../lib/utils';
import { classTokens } from '@/styles/tokens';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "glass-card p-6",
                classTokens.bg.surface,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: CardProps) {
    return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps) {
    return <h3 className={cn(classTokens.text.primary, className)}>{children}</h3>;
}

export function CardContent({ children, className }: CardProps) {
    return <div className={className}>{children}</div>;
}
