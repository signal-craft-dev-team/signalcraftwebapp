import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

export type FilterType = 'all' | 'running' | 'warning' | 'stopped';

interface MachineFiltersProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export function MachineFilters({ currentFilter, onFilterChange }: MachineFiltersProps) {
    const filters: { id: FilterType; label: string }[] = [
        { id: 'all', label: '전체' },
        { id: 'running', label: '정상 가동' },
        { id: 'warning', label: '점검 필요' },
        { id: 'stopped', label: '정지됨' },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto px-6 py-2 no-scrollbar">
            {filters.map((filter) => {
                const isActive = currentFilter === filter.id;
                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={cn(
                            "relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2",
                            isActive ? "text-white" : "text-slate-500 hover:bg-slate-100"
                        )}
                        style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-signal-blue -z-10"
                                style={{ borderRadius: 'var(--radius-lg)' }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        )}
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}
