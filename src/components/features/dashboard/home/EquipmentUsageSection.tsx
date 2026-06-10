import { useMemo, useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { classTokens, cssVars } from '@/styles/tokens';
import { cn } from '@/lib/utils';
import type { EquipmentUsageData, HomePeriod } from '@/lib/contracts/dashboardHome';
import { EquipmentGanttChart } from './EquipmentGanttChart';

interface EquipmentUsageSectionProps {
    data: EquipmentUsageData;
    onPeriodChange: (period: HomePeriod) => void;
    onMachineChange: (machineId: string) => void;
    onHelpClick: () => void;
}

const PERIOD_TO_MS: Record<HomePeriod, number> = {
    '24h': 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '5d': 5 * 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
};

// TODO: formatMinutes, getClippedMinutes — 구동 누적 복구 시 재활성화

export function EquipmentUsageSection({
    data,
    onPeriodChange,
    onMachineChange,
    onHelpClick,
}: EquipmentUsageSectionProps) {
    const [selectedMachineId, setSelectedMachineId] = useState<string>(
        data.machines[0]?.id ?? '',
    );

    const selectedMachineName = useMemo(
        () => data.machines.find((machine) => machine.id === selectedMachineId)?.name,
        [data.machines, selectedMachineId],
    );

    const periodLabel = useMemo(
        () => data.periodOptions.find((option) => option.id === data.selectedPeriod)?.label ?? '',
        [data.periodOptions, data.selectedPeriod],
    );

    const { periodStartAt, periodEndAt } = useMemo(() => {
        const segmentEnds = data.segments
            .map((segment) => new Date(segment.endedAt).getTime())
            .filter((value) => !Number.isNaN(value));
        const referenceEnd = segmentEnds.length > 0 ? Math.max(...segmentEnds) : Date.now();
        const span = PERIOD_TO_MS[data.selectedPeriod];
        return {
            periodStartAt: new Date(referenceEnd - span).toISOString(),
            periodEndAt: new Date(referenceEnd).toISOString(),
        };
    }, [data.segments, data.selectedPeriod]);


    return (
        <section className="px-6 mb-8">
            <div className="flex items-center gap-1.5 mb-4">
                <h3
                    className={cn('text-base font-bold', classTokens.text.primary)}
                    style={{ fontFamily: cssVars.fontHeading }}
                >
                    설비 정보
                </h3>
                <button
                    type="button"
                    onClick={onHelpClick}
                    aria-label="설비 정보 도움말 열기"
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

            <div
                className="flex gap-1.5 p-1 mb-4 bg-muted overflow-x-auto"
                role="tablist"
                aria-label="설비 사용 기간 선택"
                style={{ borderRadius: cssVars.radiusMd }}
            >
                {data.periodOptions.map((option) => {
                    const isActive = option.id === data.selectedPeriod;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onPeriodChange(option.id)}
                            className={cn(
                                'flex-1 whitespace-nowrap px-3 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                isActive
                                    ? 'bg-card text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                            style={{ borderRadius: 'calc(var(--radius-md) - 4px)' }}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <div className="relative mb-4">
                <select
                    aria-label="설비 선택"
                    value={selectedMachineId}
                    onChange={(event) => {
                        const next = event.target.value;
                        setSelectedMachineId(next);
                        onMachineChange(next);
                    }}
                    className={cn(
                        'appearance-none w-full px-4 py-3 pr-10 text-sm font-medium bg-card border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        classTokens.text.primary,
                        classTokens.border.subtle,
                    )}
                    style={{ borderRadius: cssVars.radiusMd }}
                >
                    {data.machines.map((machine) => (
                        <option key={machine.id} value={machine.id}>
                            {machine.name}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>

            <EquipmentGanttChart
                segments={data.segments}
                selectedMachineId={selectedMachineId}
                selectedMachineName={selectedMachineName}
                periodLabel={periodLabel}
                periodStartAt={periodStartAt}
                periodEndAt={periodEndAt}
            />

            {/* TODO: 구동 누적 — 백엔드 집계 API 확정 후 복구 */}
        </section>
    );
}
