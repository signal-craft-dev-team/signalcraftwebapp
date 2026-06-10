import { LucideIcon, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface MenuItemProps {
    id: string;
    label: string;
    icon: LucideIcon;
    color: string;
    right?: string;
    onClick: () => void;
}

export function MenuItem({ label, icon: Icon, color, right, onClick }: MenuItemProps) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-5 bg-white border border-slate-50 hover:bg-slate-50 transition-all active:scale-[0.98] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
            style={{ borderRadius: 'var(--radius-md)' }}
        >
            <div className="flex items-center gap-4">
                <div className={cn("p-3 transition-transform group-hover:scale-105", color)} style={{ borderRadius: 'var(--radius-md)' }}>
                    <Icon size={20} />
                </div>
                <span className="text-base font-semibold text-slate-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {right && <span className="text-xs font-medium text-slate-400">{right}</span>}
                <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
        </button>
    );
}
