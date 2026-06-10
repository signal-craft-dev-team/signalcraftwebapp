// Cloud Run MeResponse → 기존 FE UserProfile shape 어댑터.
// ProfileCard / DashboardPage가 동일 타입을 공유하기 위함.

import type { MeResponse } from './cloudRunApi';

export type UserProfile = {
    user: {
        email: string;
        full_name: string;
        role: string;
    };
    // Cloud Run /me 미제공 — UI는 undefined를 "미확인"으로 분기.
    device_count?: number;
    plan?: string;
    customer_name?: string;
    primary_place_name?: string;
};

export const meResponseToUserProfile = (me: MeResponse): UserProfile => {
    const primaryPlace = me.places?.[0];
    return {
        user: {
            email: me.user?.email ?? '',
            full_name: me.user?.name ?? '사용자',
            role: me.user?.role ?? '-',
        },
        customer_name: me.customer?.name,
        primary_place_name: primaryPlace?.name,
    };
};
