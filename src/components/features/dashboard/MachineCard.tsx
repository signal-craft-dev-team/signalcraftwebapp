import { useState } from 'react';
import { MoreHorizontal, Brain, Zap, AlertTriangle, CalendarClock, Trash2, Settings2 } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { classTokens, cssVars } from '@/styles/tokens';
import { getMachineIcon } from '@/lib/machineIcons';
import type { MachineStatus } from '@/lib/contracts/machineStatus';

export interface Machine {
    id: string;
    name: string;
    location: string;
    status: MachineStatus;
    health: number;
    prediction: string;
    imageUrl: string;
    type: string;
}

interface MachineCardProps {
    machine: Machine;
    index: number;
    onClick?: (machine: Machine) => void;
    onManage?: (machine: Machine) => void;
    onDelete?: (id: string) => void;
}

export function MachineCard({ machine, index, onClick, onManage, onDelete }: MachineCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getStatusVariant = (status: Machine['status']) => {
        if (status === 'running') return 'success';
        if (status === 'warning') return 'warning';
        return 'error';
    };

    const getStatusLabel = (status: Machine['status']) => {
        if (status === 'running') return '가동 중';
        if (status === 'warning') return '점검 필요';
        return '정지됨';
    };

    const PredictionIcon = machine.status === 'warning' ? AlertTriangle : machine.id.includes('2') ? CalendarClock : Brain;
    const isMachineWarning = machine.status === 'warning';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="px-2 sm:px-4 py-1.5 cursor-pointer relative"
        >
            <Card
                className={cn("p-0 overflow-hidden transition-shadow group relative", classTokens.border.subtle)}
                style={{ transitionDuration: cssVars.durationNormal, transitionTimingFunction: cssVars.easeOutQuart }}
                onClick={() => onClick?.(machine)}
            >
                <div className="p-4 sm:p-5 flex gap-4 sm:gap-5 relative z-10">
                    <div
                        className={cn("w-20 h-20 sm:w-22 sm:h-22 shrink-0 bg-gradient-to-br border overflow-hidden flex items-center justify-center", classTokens.gradient.machineIcon, classTokens.border.infoSoft)}
                        style={{ borderRadius: cssVars.radiusMd }}
                    >
                        {getMachineIcon(machine.type)}
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4
                                    className={cn("text-[16px] sm:text-[17px] font-bold leading-tight tracking-tight mb-0.5 group-hover:text-signal-blue transition-colors truncate", classTokens.text.primary)}
                                    style={{ fontFamily: cssVars.fontHeading, transitionDuration: cssVars.durationNormal }}
                                >
                                    {machine.name}
                                </h4>
                                <p className={cn("text-[12px] sm:text-[13px] font-medium tracking-tight truncate", classTokens.text.subtle)}>
                                    {machine.location}
                                </p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMenuOpen(!isMenuOpen);
                                    }}
                                    className={cn("p-2 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2", classTokens.text.disabled, classTokens.hover.subtle)}
                                    style={{ borderRadius: cssVars.radiusMd }}
                                    aria-label="설비 메뉴 열기"
                                >
                                    <MoreHorizontal size={20} />
                                </button>

                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                            transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
                                            className={cn("absolute right-0 top-12 w-32 shadow-lg border py-1.5 z-50 overflow-hidden", classTokens.bg.surface, classTokens.border.subtle)}
                                            style={{ borderRadius: cssVars.radiusMd }}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onManage?.(machine);
                                                    setIsMenuOpen(false);
                                                }}
                                                className={cn("w-full px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-colors", classTokens.text.secondary, classTokens.hover.subtle)}
                                            >
                                                <Settings2 size={16} />
                                                관리
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete?.(machine.id);
                                                    setIsMenuOpen(false);
                                                }}
                                                className={cn("w-full px-4 py-2.5 flex items-center gap-2 text-sm font-medium transition-colors", classTokens.text.dangerIcon, classTokens.hover.dangerSoft)}
                                            >
                                                <Trash2 size={16} />
                                                삭제
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-auto">
                            <Badge variant={getStatusVariant(machine.status)}>
                                {getStatusLabel(machine.status)}
                            </Badge>

                            <div className={cn("flex items-center gap-1.5 px-3 py-1.5 border", classTokens.bg.subtle, classTokens.border.subtle)}
                                style={{ borderRadius: cssVars.radiusSm }}
                            >
                                <Zap className={cn(
                                    "size-3.5",
                                    machine.health > 90 ? "text-signal-mint" : "text-signal-orange"
                                )} />
                                <span className={cn("text-[12px] font-semibold", classTokens.text.secondary)}>
                                    {machine.health}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={cn(
                        "px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 border-t",
                        classTokens.border.subtle,
                        isMachineWarning ? classTokens.machinePrediction.danger : classTokens.machinePrediction.neutral
                    )}
                >
                    <div className={cn(
                        "p-2",
                        isMachineWarning ? classTokens.machinePrediction.dangerIconBg : classTokens.machinePrediction.neutralIconBg
                    )} style={{ borderRadius: cssVars.radiusSm }}>
                        <PredictionIcon className={cn(
                            "size-4",
                            isMachineWarning ? classTokens.machinePrediction.dangerIcon : classTokens.machinePrediction.neutralIcon
                        )} />
                    </div>
                    <p className="text-[13px] font-medium tracking-tight leading-snug">
                        {machine.prediction}
                    </p>
                </div>
            </Card>
        </motion.div>
    );
}
