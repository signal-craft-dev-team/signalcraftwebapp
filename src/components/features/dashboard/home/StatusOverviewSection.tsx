import { HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { classTokens, cssVars } from '@/styles/tokens';
import { cn } from '@/lib/utils';
import type { StatusOverviewCard } from '@/lib/contracts/dashboardHome';
import { StatusInfoCard } from './StatusInfoCard';

interface StatusOverviewSectionProps {
    statusOverview: StatusOverviewCard[];
    onHelpClick: () => void;
}

export function StatusOverviewSection({ statusOverview, onHelpClick }: StatusOverviewSectionProps) {
    return (
        <section className="px-6 mb-8">
            <div className="flex items-center gap-1.5 mb-3">
                <h3
                    className={cn('text-base font-bold', classTokens.text.primary)}
                    style={{ fontFamily: cssVars.fontHeading }}
                >
                    상태 정보
                </h3>
                <button
                    type="button"
                    onClick={onHelpClick}
                    aria-label="상태 정보 도움말 열기"
                    className={cn(
                        'p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                        classTokens.text.muted,
                        classTokens.hover.subtle,
                    )}
                    style={{ borderRadius: cssVars.radiusSm }}
                >
                    <HelpCircle className="size-4" />
                </button>
            </div>
            <Card
                className={cn('px-4 py-1 divide-y', classTokens.border.subtle)}
                style={{ borderRadius: cssVars.radiusMd }}
            >
                {statusOverview.map((card) => (
                    <StatusInfoCard key={card.id} card={card} />
                ))}
            </Card>
        </section>
    );
}
