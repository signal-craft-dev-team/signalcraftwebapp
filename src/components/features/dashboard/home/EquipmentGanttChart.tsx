import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { colors, classTokens, cssVars } from '@/styles/tokens';
import { cn } from '@/lib/utils';
import type { EquipmentRunState, GanttSegment } from '@/lib/contracts/dashboardHome';

type Viewport = { start: number; end: number };
const FULL_VIEWPORT: Viewport = { start: 0, end: 1 };
const MIN_SPAN = 0.05;

interface EquipmentGanttChartProps {
    segments: GanttSegment[];
    selectedMachineId: string;
    selectedMachineName?: string;
    periodLabel: string;
    periodStartAt: string;
    periodEndAt: string;
}

const STATE_FILL: Record<EquipmentRunState, string> = {
    RUNNING: colors.primary,
    OFF: colors.danger,
    ERROR: colors.warning,
    NO_DATA: 'transparent',
};

const STATE_LABEL: Record<EquipmentRunState, string> = {
    RUNNING: '가동',
    OFF: '정지',
    ERROR: '이상',
    NO_DATA: '데이터 없음',
};

const LEGEND_STATES: EquipmentRunState[] = ['RUNNING', 'OFF', 'ERROR', 'NO_DATA'];
const NO_DATA_PATTERN =
    'repeating-linear-gradient(45deg, var(--border) 0 2px, transparent 2px 7px)';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function formatDurationShort(ms: number): string {
    if (ms < HOUR_MS) return `${Math.max(1, Math.round(ms / 60000))}분`;
    if (ms < DAY_MS) return `${Math.floor(ms / HOUR_MS)}시간`;
    return `${Math.floor(ms / DAY_MS)}일`;
}

function buildAxisLabels(startMs: number, endMs: number, hourInterval: number): Array<{ label: string; pct: number }> {
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return [];
    const span = endMs - startMs;
    const use3Hour = span <= 25 * HOUR_MS;
    const intervalMs = use3Hour ? hourInterval * HOUR_MS : DAY_MS;

    const formatter = new Intl.DateTimeFormat('ko-KR', use3Hour
        ? { hour: '2-digit', minute: '2-digit', hour12: false }
        : { month: 'numeric', day: 'numeric' });

    const labels: Array<{ label: string; pct: number }> = [];

    // 로컬 시간 기준으로 첫 tick 계산
    const startDate = new Date(startMs);
    const startHour = startDate.getHours();
    const firstIntervalHour = Math.ceil(startHour / hourInterval) * hourInterval;
    const firstTickDate = new Date(startMs);
    firstTickDate.setHours(firstIntervalHour, 0, 0, 0);
    let firstTickMs = firstTickDate.getTime();
    if (firstTickMs < startMs) firstTickMs += intervalMs;

    for (let t = firstTickMs; t <= endMs; t += intervalMs) {
        const pct = ((t - startMs) / span) * 100;
        if (pct < 0 || pct > 100) continue;
        const d = new Date(t);
        const isMidnight = d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0;
        const label = (use3Hour && isMidnight && t > startMs) ? '24:00' : formatter.format(d);
        labels.push({ label, pct });
    }

    return labels;
}

export function EquipmentGanttChart({
    segments,
    selectedMachineId,
    selectedMachineName,
    periodLabel,
    periodStartAt,
    periodEndAt,
}: EquipmentGanttChartProps) {
    const baseStartMs = new Date(periodStartAt).getTime();
    const baseEndMs = new Date(periodEndAt).getTime();
    const baseTotalMs = baseEndMs - baseStartMs;

    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : true
    );
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 640px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const hourInterval = isMobile ? 4 : 2;

    const [viewport, setViewport] = useState<Viewport>(FULL_VIEWPORT);
    const viewportRef = useRef<Viewport>(viewport);
    useEffect(() => { viewportRef.current = viewport; }, [viewport]);

    useEffect(() => {
        setViewport(FULL_VIEWPORT);
    }, [selectedMachineId, periodStartAt, periodEndAt]);

    const effectiveStartMs = baseStartMs + baseTotalMs * viewport.start;
    const effectiveEndMs = baseStartMs + baseTotalMs * viewport.end;
    const effectiveTotalMs = effectiveEndMs - effectiveStartMs;

    const chartRef = useRef<HTMLDivElement | null>(null);
    const touchStateRef = useRef<{
        mode: 'idle' | 'pinch' | 'pan';
        startDistance: number;
        startViewport: Viewport;
        anchorRatio: number;
        startTouchX: number;
        chartWidth: number;
    }>({ mode: 'idle', startDistance: 0, startViewport: FULL_VIEWPORT, anchorRatio: 0.5, startTouchX: 0, chartWidth: 0 });

    useEffect(() => {
        const el = chartRef.current;
        if (!el) return;

        const clampViewport = (next: Viewport): Viewport => {
            let { start, end } = next;
            if (end - start < MIN_SPAN) {
                const mid = (start + end) / 2;
                start = mid - MIN_SPAN / 2;
                end = mid + MIN_SPAN / 2;
            }
            if (end - start > 1) return FULL_VIEWPORT;
            if (start < 0) { end -= start; start = 0; }
            if (end > 1) { start -= (end - 1); end = 1; }
            return { start: Math.max(0, start), end: Math.min(1, end) };
        };

        const onTouchStart = (e: TouchEvent) => {
            const rect = el.getBoundingClientRect();
            touchStateRef.current.chartWidth = rect.width;
            const current = viewportRef.current;

            if (e.touches.length === 2) {
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const distance = Math.max(20, Math.abs(t1.clientX - t2.clientX));
                const centerX = (t1.clientX + t2.clientX) / 2;
                const centerInChart = Math.max(0, Math.min(1, (centerX - rect.left) / rect.width));
                const anchorRatio = current.start + centerInChart * (current.end - current.start);
                touchStateRef.current = {
                    mode: 'pinch',
                    startDistance: distance,
                    startViewport: current,
                    anchorRatio,
                    startTouchX: 0,
                    chartWidth: rect.width,
                };
            } else if (e.touches.length === 1 && (current.end - current.start) < 0.999) {
                touchStateRef.current = {
                    mode: 'pan',
                    startDistance: 0,
                    startViewport: current,
                    anchorRatio: 0,
                    startTouchX: e.touches[0].clientX,
                    chartWidth: rect.width,
                };
            }
        };

        const onTouchMove = (e: TouchEvent) => {
            const s = touchStateRef.current;
            if (s.mode === 'pinch' && e.touches.length === 2) {
                e.preventDefault();
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const distance = Math.max(20, Math.abs(t1.clientX - t2.clientX));
                const scale = distance / s.startDistance;
                const startSpan = s.startViewport.end - s.startViewport.start;
                const newSpan = Math.max(MIN_SPAN, Math.min(1, startSpan / scale));
                const centerInOldSpan = (s.anchorRatio - s.startViewport.start) / startSpan;
                const newStart = s.anchorRatio - centerInOldSpan * newSpan;
                setViewport(clampViewport({ start: newStart, end: newStart + newSpan }));
            } else if (s.mode === 'pan' && e.touches.length === 1) {
                e.preventDefault();
                const deltaX = e.touches[0].clientX - s.startTouchX;
                const span = s.startViewport.end - s.startViewport.start;
                const shift = -(deltaX / s.chartWidth) * span;
                setViewport(clampViewport({
                    start: s.startViewport.start + shift,
                    end: s.startViewport.end + shift,
                }));
            }
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (e.touches.length === 0) touchStateRef.current.mode = 'idle';
        };

        el.addEventListener('touchstart', onTouchStart, { passive: false });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd);
        el.addEventListener('touchcancel', onTouchEnd);
        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
            el.removeEventListener('touchcancel', onTouchEnd);
        };
    }, []);

    const resetZoom = useCallback(() => setViewport(FULL_VIEWPORT), []);
    const isZoomed = viewport.start > 0 || viewport.end < 1;

    const visibleSegments = useMemo(() => {
        if (!(effectiveTotalMs > 0)) return [];
        return segments
            .filter((segment) => segment.machineId === selectedMachineId)
            .map((segment) => {
                const segStart = Math.max(new Date(segment.startedAt).getTime(), effectiveStartMs);
                const segEnd = Math.min(new Date(segment.endedAt).getTime(), effectiveEndMs);
                const duration = segEnd - segStart;
                if (duration <= 0) return null;
                return {
                    ...segment,
                    leftPct: ((segStart - effectiveStartMs) / effectiveTotalMs) * 100,
                    widthPct: (duration / effectiveTotalMs) * 100,
                    durationMs: duration,
                };
            })
            .filter((segment): segment is NonNullable<typeof segment> => segment !== null);
    }, [segments, selectedMachineId, effectiveStartMs, effectiveEndMs, effectiveTotalMs]);

    const axisLabels = useMemo(
        () => buildAxisLabels(effectiveStartMs, effectiveEndMs, hourInterval),
        [effectiveStartMs, effectiveEndMs, hourInterval],
    );
    const isEmpty = visibleSegments.length === 0;

    const nowMs = Date.now();
    const showNow = effectiveTotalMs > 0 && nowMs >= effectiveStartMs && nowMs <= effectiveEndMs;
    const nowLeftPct = showNow ? ((nowMs - effectiveStartMs) / effectiveTotalMs) * 100 : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
                <h4 className={cn('text-sm font-bold', classTokens.text.primary)}>
                    {periodLabel} 가동 타임라인
                </h4>
                <div className="flex items-center gap-2">
                    {isZoomed && (
                        <button
                            type="button"
                            onClick={resetZoom}
                            aria-label="줌 초기화"
                            className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold transition-colors',
                                'bg-primary/10 text-primary hover:bg-primary/15',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                            )}
                            style={{ borderRadius: '9999px' }}
                        >
                            <RotateCcw className="size-3" />
                            원래대로
                        </button>
                    )}
                    {selectedMachineName && (
                        <span className={cn('text-[11px] font-medium truncate', classTokens.text.muted)}>
                            {selectedMachineName}
                        </span>
                    )}
                </div>
            </div>

            <div className="relative">
                <div
                    ref={chartRef}
                    role="img"
                    aria-label={`${selectedMachineName ?? '설비'} ${periodLabel} 가동 타임라인. 두 손가락으로 확대, 한 손가락으로 이동할 수 있어요.`}
                    className={cn('relative h-10 w-full overflow-hidden bg-muted border touch-none select-none', classTokens.border.subtle)}
                    style={{ borderRadius: cssVars.radiusSm }}
                >
                    {isEmpty ? (
                        <div className={cn('flex h-full w-full items-center justify-center text-[11px] font-medium', classTokens.text.muted)}>
                            기록된 가동 데이터가 없어요
                        </div>
                    ) : (
                        visibleSegments.map((segment) => {
                            const isNoData = segment.state === 'NO_DATA';
                            const showLabel = segment.widthPct >= 15;
                            return (
                                <div
                                    key={`${segment.machineId}-${segment.startedAt}-${segment.state}`}
                                    className="absolute top-0 bottom-0 flex items-center justify-center text-[10px] font-bold text-white"
                                    style={{
                                        left: `${segment.leftPct}%`,
                                        width: `${segment.widthPct}%`,
                                        backgroundColor: isNoData ? 'transparent' : STATE_FILL[segment.state],
                                        backgroundImage: isNoData ? NO_DATA_PATTERN : undefined,
                                    }}
                                    title={`${STATE_LABEL[segment.state]} · ${formatDurationShort(segment.durationMs)}`}
                                >
                                    {showLabel && (
                                        <span
                                            className={cn(
                                                'truncate px-1.5 whitespace-nowrap drop-shadow-sm',
                                                isNoData ? classTokens.text.muted : '',
                                            )}
                                        >
                                            {STATE_LABEL[segment.state]} {formatDurationShort(segment.durationMs)}
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="pointer-events-none absolute inset-0 grid grid-cols-4">
                    <div className="border-r border-white/40" />
                    <div className="border-r border-white/40" />
                    <div className="border-r border-white/40" />
                    <div />
                </div>

                {showNow && (
                    <>
                        <div
                            className="pointer-events-none absolute top-0 bottom-0 border-l-2 border-dashed border-primary"
                            style={{ left: `${nowLeftPct}%` }}
                        />
                        <span
                            className={cn(
                                'pointer-events-none absolute -top-3 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-sm whitespace-nowrap',
                                classTokens.bg.brand,
                                classTokens.text.inverse,
                            )}
                            style={{ left: `${nowLeftPct}%`, transform: 'translateX(-50%)' }}
                        >
                            지금
                        </span>
                    </>
                )}
            </div>

            {axisLabels.length > 0 && (
                <div className="relative h-4">
                    {axisLabels.map(({ label, pct }) => (
                        <span
                            key={`${label}-${pct}`}
                            className={cn('absolute text-[10px] font-medium -translate-x-1/2', classTokens.text.muted)}
                            style={{ left: `${pct}%` }}
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}

            <ul className={cn('flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-[11px] font-medium', classTokens.text.muted)}>
                {LEGEND_STATES.map((state) => (
                    <li key={state} className="flex items-center gap-1.5">
                        <span
                            aria-hidden
                            className="inline-block size-2.5"
                            style={{
                                backgroundColor: state === 'NO_DATA' ? 'transparent' : STATE_FILL[state],
                                backgroundImage: state === 'NO_DATA' ? NO_DATA_PATTERN : undefined,
                                border: state === 'NO_DATA' ? '1px solid var(--border)' : 'none',
                                borderRadius: '2px',
                            }}
                        />
                        {STATE_LABEL[state]}
                    </li>
                ))}
            </ul>
        </div>
    );
}
