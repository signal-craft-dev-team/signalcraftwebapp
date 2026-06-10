import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { throwIfNotOk } from '@/lib/apiErrorHelper';
import { Bell, Lock, FileText, LogOut, Moon } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { BottomNav } from '../../shared/BottomNav';
import { ProfileCard } from './ProfileCard';
import { SettingsGroup } from './SettingsGroup';
import { SettingsItem } from './SettingsItem';
import { Header } from '../../shared/Header';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { cssVars } from '@/styles/tokens';
import { MaterialSymbolIcon } from '@/components/ui/MaterialSymbolIcon';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
    }
};

interface NotificationSettings {
    push_enabled: boolean;
    kakao_enabled: boolean;
    anomaly_alerts: boolean;
    report_alerts: boolean;
    push_token?: string;
}

export function SettingsPage() {
    const queryClient = useQueryClient();
    const [darkMode, setDarkMode] = useState(false);

    const { data: settings, isLoading } = useQuery<NotificationSettings>({
        queryKey: QUERY_KEYS.notificationSettings,
        queryFn: async () => {
            const response = await throwIfNotOk(
                await apiFetch('/notifications/settings'),
                '/notifications/settings'
            );
            return response.json();
        },
        retry: false,
    });

    const updateSettingsMutation = useMutation({
        mutationFn: async (newSettings: Partial<NotificationSettings>) => {
            const response = await apiFetch('/notifications/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings),
            });
            if (!response.ok) throw new Error('설정 저장 실패');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationSettings });
        }
    });

    const handleToggle = (key: keyof NotificationSettings) => {
        if (!settings) return;
        const newValue = !settings[key];
        updateSettingsMutation.mutate({ [key]: newValue });
        if (key === 'push_enabled' && newValue) {
            requestNotificationPermission();
        }
    };

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) return;
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen pb-24 bg-slate-50">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="size-12 bg-slate-200 rounded-full"></div>
                        <div className="w-32 h-4 bg-slate-200" style={{ borderRadius: 'var(--radius-sm)' }}></div>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-slate-50">
            <Header />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 overflow-y-auto px-4 pt-6"
            >
                <motion.div variants={itemVariants} className="px-2 mb-6">
                    <h2 className="text-slate-900 tracking-tight">설정</h2>
                </motion.div>

                <motion.section variants={itemVariants} className="mb-8">
                    <ProfileCard />
                </motion.section>

                <motion.div variants={itemVariants}>
                    <SettingsGroup title="알림 채널">
                        <SettingsItem
                            icon={<Bell size={20} />}
                            title="앱 푸시 알림"
                            type="toggle"
                            isToggled={settings?.push_enabled}
                            onToggle={() => handleToggle('push_enabled')}
                        />
                        <SettingsItem
                            icon={<div className="size-5 bg-kakao-yellow flex items-center justify-center text-[10px] font-semibold text-kakao-brown" style={{ borderRadius: cssVars.radiusSm }}>K</div>}
                            title="카카오톡 알림"
                            type="toggle"
                            isToggled={settings?.kakao_enabled}
                            onToggle={() => handleToggle('kakao_enabled')}
                        />
                    </SettingsGroup>
                </motion.div>

                {(settings?.push_enabled || settings?.kakao_enabled) && (
                    <motion.div variants={itemVariants}>
                        <SettingsGroup title="알림 상세 설정">
                            <SettingsItem
                                title="이상 징후 즉시 알림"
                                type="toggle"
                                isToggled={settings?.anomaly_alerts}
                                onToggle={() => handleToggle('anomaly_alerts')}
                            />
                            <SettingsItem
                                title="일간/주간 AI 리포트"
                                type="toggle"
                                isToggled={settings?.report_alerts}
                                onToggle={() => handleToggle('report_alerts')}
                            />
                        </SettingsGroup>
                    </motion.div>
                )}

                <motion.div variants={itemVariants}>
                    <SettingsGroup title="앱 설정">
                        <SettingsItem
                            icon={<Moon size={20} />}
                            title="다크 모드"
                            type="toggle"
                            isToggled={darkMode}
                            onToggle={() => setDarkMode(!darkMode)}
                        />
                    </SettingsGroup>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <SettingsGroup title="일반">
                        <SettingsItem
                            icon={<Lock size={20} />}
                            title="보안 및 개인정보"
                            type="link"
                        />
                        <SettingsItem
                            icon={<MaterialSymbolIcon name="help" size={20} />}
                            title="고객센터"
                            type="link"
                        />
                    </SettingsGroup>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <SettingsGroup title="정보">
                        <SettingsItem
                            icon={<FileText size={20} />}
                            title="약관 및 정책"
                            type="link"
                        />
                        <SettingsItem
                            title="앱 버전"
                            type="info"
                            value="1.0.2 (Beta)"
                        />
                    </SettingsGroup>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-8 px-4">
                    <button
                        className="w-full py-4 text-slate-400 font-medium text-sm bg-slate-100 transition-colors flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                        style={{ borderRadius: 'var(--radius-md)' }}
                    >
                        <LogOut size={16} />
                        로그아웃
                    </button>
                    <p className="text-center text-slate-300 text-xs mt-4 font-medium">
                        SignalCraft Biz for Enterprise
                    </p>
                </motion.div>
            </motion.main>

            <BottomNav />
        </div>
    );
}
