import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Zap, AlertCircle, CheckCircle2, Settings2, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { throwIfNotOk, getEndpointPendingMode } from '@/lib/apiErrorHelper';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { classTokens } from '@/styles/tokens';
import { EndpointPending } from './EndpointPending';

interface Notification {
    id: string;
    type: 'alert' | 'report' | 'maintenance';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 172800) return '어제';
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
}

const TYPE_CONFIG = {
    alert: {
        icon: AlertCircle,
        color: classTokens.notificationType.alert,
    },
    report: {
        icon: Zap,
        color: classTokens.notificationType.report,
    },
    maintenance: {
        icon: CheckCircle2,
        color: classTokens.notificationType.maintenance,
    }
};

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<{ notifications: Notification[] }>({
        queryKey: QUERY_KEYS.notifications,
        queryFn: async () => {
            const response = await throwIfNotOk(await apiFetch('/notifications/'), '/notifications/');
            return response.json();
        },
        enabled: isOpen,
    });

    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await apiFetch(`/notifications/${id}/read`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('알림 읽음 처리 실패');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            const response = await apiFetch('/notifications/mark-all-read', {
                method: 'POST',
            });
            if (!response.ok) throw new Error('전체 읽음 처리 실패');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
        },
    });

    const notifications = data?.notifications || [];

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
                        onClick={(e) => e.stopPropagation()}
                        className="fixed inset-x-0 bottom-0 bg-white z-[101] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
                        style={{ borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-50 text-slate-400" style={{ borderRadius: 'var(--radius-sm)' }}>
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>알림</h3>
                                    <p className="text-xs text-slate-400 font-medium">새로운 소식을 확인하세요</p>
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

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 pb-12 min-h-[300px]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                                    <Loader2 className="size-8 animate-spin" />
                                    <p className="font-medium text-sm">알림을 불러오는 중...</p>
                                </div>
                            ) : error ? (
                                <div className="py-4">
                                    <EndpointPending
                                        title="알림 기능을 준비 중이에요"
                                        description="알림 서비스가 곧 제공됩니다."
                                        icon={Bell}
                                        mode={getEndpointPendingMode(error)}
                                    />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400">
                                    <Bell size={40} className="mb-2 opacity-20" />
                                    <p className="font-medium text-sm">새로운 알림이 없습니다</p>
                                </div>
                            ) : (
                                notifications.map((notif) => {
                                    const config = TYPE_CONFIG[notif.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.alert;
                                    const Icon = config.icon;

                                    return (
                                        <div
                                            key={notif.id}
                                            onClick={() => !notif.isRead && markAsReadMutation.mutate(notif.id)}
                                            className={cn(
                                                "p-5 border transition-all active:scale-[0.98] relative cursor-pointer",
                                                notif.isRead ? "bg-white border-slate-100 opacity-60" : "bg-slate-50 border-slate-100 shadow-card"
                                            )}
                                            style={{ borderRadius: 'var(--radius-md)' }}
                                        >
                                            {!notif.isRead && (
                                                <div className="absolute top-5 right-5 size-2 bg-rose-500 rounded-full" />
                                            )}
                                            <div className="flex gap-4">
                                                <div className={cn("size-12 shrink-0 flex items-center justify-center", config.color)}
                                                    style={{ borderRadius: 'var(--radius-md)' }}
                                                >
                                                    <Icon size={24} />
                                                </div>
                                                <div className="flex-1 pr-4">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>{notif.title}</h4>
                                                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                                                            {formatRelativeTime(notif.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-slate-500 leading-relaxed break-keep">
                                                        {notif.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer Quick Actions */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                            <button
                                onClick={() => markAllReadMutation.mutate()}
                                disabled={notifications.every(n => n.isRead)}
                                className="text-sm font-medium text-slate-400 hover:text-slate-600 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue"
                            >
                                모두 읽음으로 표시
                            </button>
                            <button className="flex items-center gap-1.5 text-sm font-medium text-signal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue">
                                <Settings2 size={16} />
                                알림 설정
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
