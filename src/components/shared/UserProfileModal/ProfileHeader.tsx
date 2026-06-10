import { User, X } from 'lucide-react';
import { mockScenario } from '@/lib/mockScenario';

interface ProfileHeaderProps {
    onClose: () => void;
}

export function ProfileHeader({ onClose }: ProfileHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
                <div className="size-16 bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm"
                    style={{ borderRadius: 'var(--radius-lg)' }}
                >
                    <User size={32} className="text-slate-300" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>{mockScenario.userProfile.full_name}</h3>
                        <span className="px-2 py-0.5 bg-signal-blue text-white text-[10px] font-semibold rounded-full uppercase">PRO</span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">{mockScenario.userProfile.email}</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="size-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue"
                aria-label="닫기"
            >
                <X size={20} />
            </button>
        </div>
    );
}
