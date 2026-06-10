import { Wrench, Radio, Server } from 'lucide-react';
import { classTokens, cssVars } from '@/styles/tokens';
import { cn } from '@/lib/utils';
import type { HomeStatusKind, StatusOverviewCard } from '@/lib/contracts/dashboardHome';

interface StatusInfoCardProps {
    card: StatusOverviewCard;
}

const ICON_BY_ID = {
    machines: Wrench,
    edgeSensors: Radio,
    server: Server,
} as const;

const STATE_LABEL: Record<HomeStatusKind, string> = {
    healthy: '연결 상태 양호',
    warning: '연결 상태 보통',
    danger: '연결 상태 불량',
};

const STATE_DOT: Record<HomeStatusKind, string> = {
    healthy: 'bg-emerald-500',
    warning: 'bg-warning',
    danger: 'bg-danger',
};

const STATE_COUNT_COLOR: Record<HomeStatusKind, string> = {
    healthy: classTokens.text.primary,
    warning: classTokens.text.warning,
    danger: classTokens.text.danger,
};

export function StatusInfoCard({ card }: StatusInfoCardProps) {
    const Icon = ICON_BY_ID[card.id];

    return (
        <div
            role="group"
            aria-label={`${card.title} ${STATE_LABEL[card.state]}, ${card.healthyCount} / ${card.totalCount}`}
            className="flex items-center gap-4 py-3.5"
        >
            <div
                className="flex items-center justify-center size-14 bg-primary shrink-0"
                style={{ borderRadius: cssVars.radiusMd }}
            >
                <Icon className="size-7 text-white" strokeWidth={2.25} />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <span
                    className={cn(
                        'inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 text-[11px] font-medium border bg-card',
                        classTokens.border.subtle,
                        classTokens.text.muted,
                    )}
                    style={{ borderRadius: '9999px' }}
                >
                    <span aria-hidden className={cn('size-2 rounded-full', STATE_DOT[card.state])} />
                    {STATE_LABEL[card.state]}
                </span>
                <h4
                    className={cn('text-base font-bold truncate', classTokens.text.primary)}
                    style={{ fontFamily: cssVars.fontHeading }}
                >
                    {card.title}
                </h4>
            </div>

            <p
                className={cn('text-xl font-bold shrink-0 tabular-nums', STATE_COUNT_COLOR[card.state])}
                style={{ fontFamily: cssVars.fontHeading }}
            >
                {card.healthyCount}/{card.totalCount}
            </p>
        </div>
    );
}
