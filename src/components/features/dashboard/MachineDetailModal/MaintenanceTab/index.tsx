import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, History, Plus, CheckCircle2, Settings2, Wrench, X, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../../../ui/Button';
import { cn } from '../../../../../lib/utils';
import { type MaintenanceView } from '../types';
import { type Machine } from '../../MachineCard';
import { MaintenanceRecordModal } from './MaintenanceRecordModal';
import { apiFetch } from '@/lib/api';
import { throwIfNotOk, getEndpointPendingMode } from '@/lib/apiErrorHelper';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { classTokens } from '@/styles/tokens';
import { EndpointPending } from '../../../../shared/EndpointPending';

interface MaintenanceTabProps {
    machine: Machine;
    maintenanceView: MaintenanceView;
    setMaintenanceView: (view: MaintenanceView) => void;
    symptom: string;
    setSymptom: (s: string) => void;
    visitDate: string;
    setVisitDate: (d: string) => void;
    urgency: 'normal' | 'urgent';
    setUrgency: (u: 'normal' | 'urgent') => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting?: boolean;
}

export function MaintenanceTab({
    machine,
    maintenanceView,
    setMaintenanceView,
    symptom,
    setSymptom,
    visitDate,
    setVisitDate,
    urgency,
    setUrgency,
    onSubmit,
    isSubmitting
}: MaintenanceTabProps) {
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

    const { data: history, isPending, error } = useQuery<any[]>({
        queryKey: QUERY_KEYS.maintenanceHistory(machine.id),
        queryFn: async () => {
            const response = await throwIfNotOk(
                await apiFetch(`/dashboard/machine-detail/maintenance?machine_id=${machine.id}`),
                '/dashboard/machine-detail/maintenance'
            );
            return response.json();
        },
    });

    const getActionTypeLabel = (type: string) => {
        switch (type) {
            case 'CLEANING': return '청소/세척';
            case 'CHECK': return '정기 점검';
            case 'PART_REPLACE': return '부품 교체';
            default: return type;
        }
    };

    const getActionBadgeClass = (type: string) => {
        if (type === 'CLEANING') return classTokens.maintenanceAction.CLEANING.badge;
        if (type === 'PART_REPLACE') return classTokens.maintenanceAction.PART_REPLACE.badge;
        return classTokens.maintenanceAction.CHECK.badge;
    };

    return (
        <motion.div
            key="maintenance"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-8 pb-10"
        >
            <AnimatePresence mode="wait">
                {maintenanceView === 'history' ? (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-8"
                    >
                        {/* Smart Advice Card */}
                        <section>
                            <div className="p-6 bg-amber-50 border border-amber-100 relative overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-amber-100 text-amber-600" style={{ borderRadius: 'var(--radius-md)' }}>
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 leading-tight mb-1 break-keep" style={{ fontFamily: 'var(--font-heading)' }}>
                                            {machine.status === 'warning' ? '점검이 권장되는 상태입니다' : '정기 점검을 관리해보세요'}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed break-keep">
                                            {machine.status === 'warning'
                                                ? "최근 기계 소리에서 미세한 마찰음이 감지되었습니다. 큰 고장으로 이어지기 전에 소모품 점검을 추천합니다."
                                                : "현재 설비 상태가 안정적입니다. 주기적인 필터 청소만으로도 설비 수명을 20% 이상 연장할 수 있습니다."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Timeline */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                    <History size={20} className="text-signal-blue" />
                                    최근 관리 이력
                                </h3>
                                <Button
                                    onClick={() => setIsRecordModalOpen(true)}
                                    variant="secondary"
                                    className="h-10 px-4 text-xs gap-1.5 bg-slate-50 border-none transition-all active:scale-[0.97]"
                                    style={{ borderRadius: 'var(--radius-sm)' }}
                                >
                                    <Plus size={16} />
                                    기록 추가
                                </Button>
                            </div>

                            {isPending ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <Loader2 className="size-6 text-signal-blue animate-spin" />
                                    <p className="text-slate-400 font-medium text-xs">이력을 불러오고 있습니다...</p>
                                </div>
                            ) : error ? (
                                <div className="py-4">
                                    <EndpointPending
                                        title="유지보수 이력을 준비 중이에요"
                                        description="정비 기록을 정리하고 있어요."
                                        icon={Wrench}
                                        mode={getEndpointPendingMode(error)}
                                    />
                                </div>
                            ) : (
                                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                                    {history && history.length > 0 ? history.map((log, i) => (
                                        <div key={log.id || i} className="relative flex items-start gap-6 pl-2">
                                            <div className="mt-1.5 size-6 shrink-0 rounded-full border-4 border-white bg-signal-blue shadow-sm z-10" />
                                            <div className="flex-1 p-5 bg-white border border-slate-100 shadow-card transition-all hover:shadow-card-hover"
                                                style={{ borderRadius: 'var(--radius-md)' }}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="section-label mb-0">
                                                        {new Date(log.performed_at).toLocaleDateString()}
                                                    </span>
                                                    <span className={cn(
                                                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                                                        getActionBadgeClass(log.action_type)
                                                    )}>
                                                        {getActionTypeLabel(log.action_type)}
                                                    </span>
                                                </div>
                                                <h4 className="text-[15px] font-semibold text-slate-800 mb-2 leading-relaxed">{log.description}</h4>
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                                    <span className="text-xs font-medium text-emerald-500">정상 기록됨</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="pl-12 py-8 text-slate-400 text-sm font-medium">등록된 관리 이력이 없습니다.</div>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Call Technician */}
                        <section>
                            <div className="p-6 bg-slate-100 text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4"
                                style={{ borderRadius: 'var(--radius-lg)' }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white shadow-sm" style={{ borderRadius: 'var(--radius-md)' }}>
                                        <Settings2 size={24} className="text-signal-blue" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg break-keep" style={{ fontFamily: 'var(--font-heading)' }}>수리 전문가의 도움이 필요하신가요?</h4>
                                        <p className="text-xs text-slate-400 font-medium break-keep">기사님이 방문하여 꼼꼼하게 점검해 드립니다</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setMaintenanceView('request')}
                                    className="bg-slate-900 text-white hover:bg-black px-5 h-12 font-semibold transition-all active:scale-[0.97] w-full sm:w-auto shrink-0 whitespace-nowrap"
                                    style={{ borderRadius: 'var(--radius-sm)' }}
                                >
                                    호출하기
                                </Button>
                            </div>
                        </section>
                    </motion.div>
                ) : maintenanceView === 'request' ? (
                    <motion.div
                        key="request"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => setMaintenanceView('history')}
                                className="p-2 -ml-2 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue"
                                style={{ borderRadius: 'var(--radius-sm)' }}
                                aria-label="뒤로가기"
                            >
                                <X size={20} className="rotate-90" />
                            </button>
                            <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>서비스 신청서</h3>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">어디가 불편하신가요?</label>
                                <textarea
                                    value={symptom}
                                    onChange={(e) => setSymptom(e.target.value)}
                                    className="w-full h-32 p-4 bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-signal-blue/20 focus:border-signal-blue text-sm font-medium text-slate-600 resize-none break-keep"
                                    style={{ borderRadius: 'var(--radius-md)' }}
                                    placeholder="기계 소리가 크거나 시원하지 않은 등 증상을 적어주세요."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">방문 희망 일시</label>
                                    <input
                                        type="datetime-local"
                                        value={visitDate}
                                        onChange={(e) => setVisitDate(e.target.value)}
                                        max="9999-12-31T23:59"
                                        className="w-full p-4 bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-signal-blue/20 focus:border-signal-blue text-sm font-medium text-slate-600"
                                        style={{ borderRadius: 'var(--radius-md)' }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">긴급도</label>
                                    <div className="flex p-1 bg-slate-100 h-[54px]" style={{ borderRadius: 'var(--radius-md)' }}>
                                        <button
                                            type="button"
                                            onClick={() => setUrgency('normal')}
                                            className={cn(
                                                "flex-1 text-xs font-semibold transition-all",
                                                urgency === 'normal' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                                            )}
                                            style={{ borderRadius: 'calc(var(--radius-md) - 4px)' }}
                                        >
                                            일반
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUrgency('urgent')}
                                            className={cn(
                                                "flex-1 text-xs font-semibold transition-all",
                                                urgency === 'urgent' ? "bg-rose-500 text-white shadow-sm" : "text-slate-400"
                                            )}
                                            style={{ borderRadius: 'calc(var(--radius-md) - 4px)' }}
                                        >
                                            긴급
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-signal-blue hover:brightness-110 text-white font-semibold text-lg transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
                                    style={{ borderRadius: 'var(--radius-md)' }}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                                    {isSubmitting ? '신청 중...' : '서비스 신청하기'}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setMaintenanceView('history')}
                                    className="w-full mt-4 text-sm font-medium text-slate-400 hover:text-slate-600"
                                >
                                    취소하고 돌아가기
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="size-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            >
                                <CheckCircle2 size={48} />
                            </motion.div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>신청이 완료되었습니다!</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            담당 기사님이 배정되는 대로<br />알림톡으로 안내해 드리겠습니다.
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-sm font-medium text-slate-400">
                            <History size={16} />
                            <span>곧 화면이 닫힙니다...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <MaintenanceRecordModal
                isOpen={isRecordModalOpen}
                onClose={() => setIsRecordModalOpen(false)}
                machineId={machine.id}
                machineName={machine.name}
            />
        </motion.div>
    );
}
