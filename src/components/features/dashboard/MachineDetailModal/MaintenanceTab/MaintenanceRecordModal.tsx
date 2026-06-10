import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, FileText, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '../../../../../lib/utils';
import { Button } from '../../../../ui/Button';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { classTokens } from '@/styles/tokens';

interface MaintenanceRecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    machineId: string;
    machineName: string;
}

type ActionType = 'CLEANING' | 'CHECK' | 'PART_REPLACE';

const actionTypes: { id: ActionType; label: string; icon: any; color: string }[] = [
    { id: 'CLEANING', label: '청소/세척', icon: Wrench, color: classTokens.maintenanceAction.CLEANING.icon },
    { id: 'CHECK', label: '정기 점검', icon: FileText, color: classTokens.maintenanceAction.CHECK.icon },
    { id: 'PART_REPLACE', label: '부품 교체', icon: CheckCircle2, color: classTokens.maintenanceAction.PART_REPLACE.icon },
];

export function MaintenanceRecordModal({ isOpen, onClose, machineId, machineName }: MaintenanceRecordModalProps) {
    const [actionType, setActionType] = useState<ActionType>('CHECK');
    const [description, setDescription] = useState('');
    const [performedAt, setPerformedAt] = useState(new Date().toISOString().slice(0, 16));
    const [isSuccess, setIsSuccess] = useState(false);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await apiFetch('/dashboard/machine-detail/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('저장에 실패했습니다.');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maintenanceHistory(machineId) });
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                setDescription('');
            }, 2000);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            device_id: machineId,
            action_type: actionType,
            description,
            performed_at: performedAt
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 z-[110]"
                        style={{ backdropFilter: 'blur(4px)' }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: 16 }}
                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                        className="fixed inset-x-4 top-[15%] max-w-lg mx-auto bg-white shadow-2xl z-[111] overflow-hidden flex flex-col"
                        style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                        {/* Header */}
                        <div className="bg-slate-50 border-b border-slate-100 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-signal-blue/10 flex items-center justify-center" style={{ borderRadius: 'var(--radius-md)' }}>
                                        <Wrench size={20} className="text-signal-blue" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>유지보수 기록 추가</h2>
                                        <p className="text-xs font-medium text-slate-400">{machineName}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="size-8 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue"
                                    aria-label="닫기"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-12 text-center"
                                >
                                    <div className="size-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>저장 완료!</h3>
                                    <p className="text-slate-500 font-medium">기록이 안전하게 보관되었습니다.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Action Type Selection */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-slate-700 block ml-1">작업 유형</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {actionTypes.map((type) => (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setActionType(type.id)}
                                                    className={cn(
                                                        "flex flex-col items-center gap-3 p-4 border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2",
                                                        actionType === type.id
                                                            ? "bg-white border-signal-blue shadow-lg scale-[1.02]"
                                                            : "bg-slate-50 border-transparent text-slate-400 opacity-60 grayscale"
                                                    )}
                                                    style={{ borderRadius: 'var(--radius-lg)' }}
                                                >
                                                    <div className={cn("size-10 flex items-center justify-center", type.color)} style={{ borderRadius: 'var(--radius-sm)' }}>
                                                        <type.icon size={20} />
                                                    </div>
                                                    <span className={cn(
                                                        "text-[11px] font-semibold tracking-tight",
                                                        actionType === type.id ? "text-slate-900" : "text-slate-400"
                                                    )}>
                                                        {type.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Performed At */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700 block ml-1">수행 일시</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="datetime-local"
                                                value={performedAt}
                                                onChange={(e) => setPerformedAt(e.target.value)}
                                                max="9999-12-31T23:59"
                                                className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-signal-blue/20 focus:border-signal-blue transition-all"
                                                style={{ borderRadius: 'var(--radius-md)' }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-slate-700 block ml-1">상세 내용</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full h-32 p-5 bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-signal-blue/20 focus:border-signal-blue text-sm font-medium text-slate-900 placeholder:text-slate-400 leading-relaxed transition-all resize-none"
                                            style={{ borderRadius: 'var(--radius-lg)' }}
                                            placeholder="점검 내용이나 교체한 부품 정보를 입력해주세요."
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={mutation.isPending}
                                        className="w-full h-14 bg-slate-900 hover:bg-black text-white font-semibold text-base shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                                        style={{ borderRadius: 'var(--radius-lg)' }}
                                    >
                                        {mutation.isPending ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            "기록 저장하기"
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
