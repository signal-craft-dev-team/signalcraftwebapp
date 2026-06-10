export function SettingsPage() {
    return null;
}

/*
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

    ... (전체 JSX 및 핸들러 생략)
}
*/
