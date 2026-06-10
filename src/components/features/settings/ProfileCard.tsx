import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryKeys';
import type { MeResponse } from '@/lib/contracts/cloudRunApi';
import {
    meResponseToUserProfile,
    type UserProfile,
} from '@/lib/contracts/userProfileAdapter';

export function ProfileCard() {
    const { data: profile, isPending } = useQuery<UserProfile>({
        queryKey: QUERY_KEYS.userProfile,
        queryFn: async () => {
            const response = await apiFetch('/me');
            if (!response.ok) {
                throw new Error('프로필 정보를 불러오는데 실패했습니다.');
            }
            const me = (await response.json()) as MeResponse;
            return meResponseToUserProfile(me);
        },
    });

    if (isPending) {
        return (
            <div className="flex items-center gap-4 p-4 bg-white shadow-card animate-pulse border border-slate-100"
                style={{ borderRadius: 'var(--radius-md)' }}
            >
                <div className="size-16 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-24" />
                    <div className="h-3 bg-slate-100 rounded w-32" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="flex items-center gap-4 p-4 bg-white shadow-card cursor-pointer border border-slate-100 hover:border-slate-200 transition-colors"
            style={{ borderRadius: 'var(--radius-md)' }}
        >
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-50 overflow-hidden">
                <User className="size-8 text-slate-300" />
            </div>

            <div className="flex-1">
                <h3 className="text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    {profile?.user.full_name || '사용자'} 님
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-0.5">
                    {profile?.user.role}
                    {profile?.device_count !== undefined && ` • 연결 기기 ${profile.device_count}대`}
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">{profile?.user.email}</p>
            </div>

            <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-500 rounded text-[10px] font-semibold">
                    {profile?.plan ?? '미정'}
                </span>
                <button
                    className="px-3 py-1.5 bg-slate-50 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                >
                    내 정보
                </button>
            </div>
        </motion.div>
    );
}
