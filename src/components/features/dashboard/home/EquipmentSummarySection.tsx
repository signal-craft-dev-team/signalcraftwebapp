import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { classTokens, cssVars } from '@/styles/tokens';
import { cn } from '@/lib/utils';
import { getMachineIcon } from '@/lib/machineIcons';
import type { EquipmentSummaryItem, EquipmentSummaryState } from '@/lib/contracts/dashboardHome';

interface EquipmentSummarySectionProps {
    items: EquipmentSummaryItem[];
    onHelpClick?: () => void;
}

const ITEMS_PER_PAGE = 4;
const SWIPE_VELOCITY_THRESHOLD = 300;
const SWIPE_OFFSET_RATIO = 0.25;

const STATE_LABEL: Record<EquipmentSummaryState, string> = {
    RUNNING: '가동중',
    OFF: '정지',
};

const STATE_BADGE_CLASS: Record<EquipmentSummaryState, string> = {
    RUNNING: 'bg-emerald-500/10 text-emerald-600',
    OFF: 'bg-muted text-muted-foreground',
};

const STATE_DOT_CLASS: Record<EquipmentSummaryState, string> = {
    RUNNING: 'bg-emerald-500',
    OFF: 'bg-muted-foreground/50',
};

function chunk<T>(arr: T[], size: number): T[][] {
    if (size <= 0) return [arr];
    const pages: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        pages.push(arr.slice(i, i + size));
    }
    return pages;
}

export function EquipmentSummarySection({ items, onHelpClick }: EquipmentSummarySectionProps) {
    const pages = useMemo(() => chunk(items, ITEMS_PER_PAGE), [items]);
    const pageCount = pages.length;
    const [currentPage, setCurrentPage] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        const update = () => setContainerWidth(element.clientWidth);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (currentPage > pageCount - 1) setCurrentPage(Math.max(0, pageCount - 1));
    }, [currentPage, pageCount]);

    const handleDragEnd = (_event: unknown, info: PanInfo) => {
        if (pageCount < 2) return;
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        const threshold = containerWidth * SWIPE_OFFSET_RATIO;

        let next = currentPage;
        if (offset < -threshold || velocity < -SWIPE_VELOCITY_THRESHOLD) {
            next = Math.min(pageCount - 1, currentPage + 1);
        } else if (offset > threshold || velocity > SWIPE_VELOCITY_THRESHOLD) {
            next = Math.max(0, currentPage - 1);
        }
        setCurrentPage(next);
    };

    if (items.length === 0) return null;

    return (
        <section className="px-6 mb-8" aria-label="설비 요약">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                    <h3
                        className={cn('text-base font-bold', classTokens.text.primary)}
                        style={{ fontFamily: cssVars.fontHeading }}
                    >
                        설비 요약
                    </h3>
                    {onHelpClick && (
                        <button
                            type="button"
                            onClick={onHelpClick}
                            aria-label="설비 요약 도움말 열기"
                            className={cn(
                                'p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                                classTokens.text.muted,
                                classTokens.hover.subtle,
                            )}
                            style={{ borderRadius: cssVars.radiusSm }}
                        >
                            <HelpCircle className="size-4" />
                        </button>
                    )}
                </div>
                <span className={cn('text-xs font-medium', classTokens.text.muted)}>
                    전체 {items.length}대
                </span>
            </div>

            <div ref={containerRef} className="overflow-hidden touch-pan-y">
                <motion.div
                    className="flex"
                    drag={pageCount > 1 ? 'x' : false}
                    dragConstraints={{
                        left: -((pageCount - 1) * containerWidth),
                        right: 0,
                    }}
                    dragElastic={0.2}
                    dragMomentum={false}
                    animate={{ x: -currentPage * containerWidth }}
                    transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                    onDragEnd={handleDragEnd}
                >
                    {pages.map((page, pageIndex) => (
                        <div
                            key={pageIndex}
                            className="shrink-0 grid grid-cols-2 gap-3 pr-0"
                            style={{ width: containerWidth || '100%' }}
                        >
                            {page.map((item) => (
                                <Card
                                    key={item.id}
                                    role="group"
                                    aria-label={`${item.name} ${STATE_LABEL[item.state]}`}
                                    className={cn(
                                        'flex flex-col gap-2 p-3',
                                        classTokens.border.subtle,
                                        'border',
                                    )}
                                    style={{ borderRadius: cssVars.radiusMd }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            aria-hidden
                                            className="flex items-center justify-center size-10 shrink-0 bg-primary/10"
                                            style={{ borderRadius: cssVars.radiusSm }}
                                        >
                                            {getMachineIcon(item.type, 'size-6')}
                                        </div>
                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold ml-auto',
                                                STATE_BADGE_CLASS[item.state],
                                            )}
                                            style={{ borderRadius: '9999px' }}
                                        >
                                            <span
                                                aria-hidden
                                                className={cn('size-1.5 rounded-full', STATE_DOT_CLASS[item.state])}
                                            />
                                            {STATE_LABEL[item.state]}
                                        </span>
                                    </div>
                                    <p
                                        className={cn('text-sm font-semibold truncate', classTokens.text.primary)}
                                        title={item.name}
                                    >
                                        {item.name}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {pageCount > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-3" role="tablist" aria-label="설비 요약 페이지">
                    {pages.map((_, index) => {
                        const isActive = index === currentPage;
                        return (
                            <button
                                key={index}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-label={`${index + 1}페이지로 이동`}
                                onClick={() => setCurrentPage(index)}
                                className={cn(
                                    'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                                    isActive ? 'w-5 h-1.5 bg-primary' : 'size-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50',
                                )}
                                style={{ borderRadius: '9999px' }}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}
