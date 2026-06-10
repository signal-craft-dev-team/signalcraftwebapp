import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Volume2, History, FileText } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '../../../../lib/utils';
import { AnalysisTab } from './AnalysisTab';
import { SmartLogTab } from './SmartLogTab';
import { MaintenanceTab } from './MaintenanceTab';
import { type MachineDetailModalProps, type TabType, type MaintenanceView } from './types';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { classTokens } from '@/styles/tokens';

export function MachineDetailModal({ machine, isOpen, onClose, initialView = 'analysis' }: MachineDetailModalProps) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabType>(initialView);
    const [maintenanceView, setMaintenanceView] = useState<MaintenanceView>('history');

    const [symptom, setSymptom] = useState('');
    const [visitDate, setVisitDate] = useState('');
    const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');

    const { mutate: submitTicket, isPending: isSubmitting } = useMutation({
        mutationFn: async () => {
            const body = {
                device_id: machine?.id,
                issue_type: "MAINTENANCE",
                description: symptom,
                urgency: urgency,
                visit_date: visitDate || null
            };
            const response = await apiFetch('/dashboard/machine-detail/service-tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error('서비스 신청에 실패했습니다.');
            return response.json();
        },
        onSuccess: () => {
            setMaintenanceView('success');
            if (machine?.id) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.maintenanceHistory(machine.id) });
            }
        }
    });

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialView);
            setMaintenanceView('history');
            if (machine) setSymptom(machine.prediction);
        }
    }, [isOpen, initialView, machine]);

    useEffect(() => {
        if (maintenanceView === 'success') {
            const timer = setTimeout(() => {
                onClose();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [maintenanceView, onClose]);

    if (!machine) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitTicket();
    };

    const theme = classTokens.machineStatus[machine.status];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 z-[100]"
                        style={{ backdropFilter: 'blur(4px)' }}
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 top-[10%] bg-white z-[101] overflow-hidden flex flex-col shadow-2xl"
                        style={{ borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}
                    >
                        {/* Handle bar */}
                        <div className="w-full flex justify-center py-4">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full" />
                        </div>

                        {/* Header & Tabs */}
                        <div className="px-6 border-b border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-3", theme.bg)} style={{ borderRadius: 'var(--radius-md)' }}>
                                        <Volume2 className={cn("size-6", theme.icon)} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>{machine.name}</h2>
                                        <p className="text-sm text-slate-400 font-medium">{machine.location}</p>
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

                            {/* Custom Tabs */}
                            <div className="flex gap-8">
                                {[
                                    { id: 'analysis', label: '소리 분석', icon: Activity },
                                    { id: 'smartlog', label: '스마트 일지', icon: FileText },
                                    { id: 'maintenance', label: '유지보수 기록', icon: History },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id as TabType);
                                            if (tab.id === 'maintenance') setMaintenanceView('history');
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 pb-4 text-sm font-semibold transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2",
                                            activeTab === tab.id ? "text-signal-blue" : "text-slate-400"
                                        )}
                                    >
                                        <tab.icon size={18} />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="detailActiveTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-signal-blue rounded-t-full"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-8">
                            <AnimatePresence mode="wait">
                                {activeTab === 'analysis' && (
                                    <AnalysisTab
                                        machine={machine}
                                        onViewMaintenance={() => setActiveTab('maintenance')}
                                    />
                                )}

                                {activeTab === 'smartlog' && (
                                    <SmartLogTab machine={machine} />
                                )}

                                {activeTab === 'maintenance' && (
                                    <MaintenanceTab
                                        machine={machine}
                                        maintenanceView={maintenanceView}
                                        setMaintenanceView={setMaintenanceView}
                                        symptom={symptom}
                                        setSymptom={setSymptom}
                                        visitDate={visitDate}
                                        setVisitDate={setVisitDate}
                                        urgency={urgency}
                                        setUrgency={setUrgency}
                                        onSubmit={handleSubmit}
                                        isSubmitting={isSubmitting}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
