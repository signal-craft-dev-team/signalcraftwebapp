import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Download } from 'lucide-react';
import { NotificationModal } from './NotificationModal';
import { UserProfileModal } from './UserProfileModal';
import { usePWAInstall } from '@/lib/usePWAInstall';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { throwIfNotOk } from '@/lib/apiErrorHelper';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { effects } from '@/styles/tokens';
import signalCraftLogo from '@/assets/signalcraft-logo.png';

export function Header() {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { isInstallable, isInstalled, isIOS, installPWA } = usePWAInstall();

    // 알림 엔드포인트가 아직 준비 안 됐으면 (404) 뱃지 숨김으로 silent 폴백.
    const { data } = useQuery({
        queryKey: QUERY_KEYS.notifications,
        queryFn: async () => {
            const response = await throwIfNotOk(await apiFetch('/notifications/'), '/notifications/');
            return response.json();
        },
        retry: false,
    });

    const unreadCount = data?.notifications?.filter((n: any) => !n.isRead).length || 0;

    // Show button if it's installable OR if it's iOS and not yet installed
    const showInstallButton = (isInstallable || (isIOS && !isInstalled)) && !isInstalled;

    return (
        <>
            <header className="flex items-center bg-slate-50 p-4 justify-between sticky top-0 z-40 border-b border-slate-100"
                style={effects.headerFrosted}
            >
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                    aria-label="SignalCraft 홈으로 이동"
                >
                    <div className="flex size-10 items-center justify-center overflow-hidden bg-signal-blue"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                        <img
                            src={signalCraftLogo}
                            alt=""
                            className="size-full object-cover"
                            aria-hidden="true"
                        />
                    </div>
                    <h2 className="text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>SignalCraft</h2>
                </Link>

                <div className="hidden items-center gap-2">
                    {showInstallButton && (
                        <button
                            onClick={() => {
                                if (isIOS) {
                                    alert('아이폰에서는 공유 버튼 -> "홈 화면에 추가"를 눌러 설치해 주세요!');
                                } else {
                                    installPWA();
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-signal-blue bg-blue-50 hover:bg-blue-100 transition-colors font-medium text-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                            aria-label="앱 설치"
                        >
                            <Download size={18} />
                            <span>앱 설치</span>
                        </button>
                    )}
                    <button
                        onClick={() => setIsNotifOpen(true)}
                        className="p-2.5 text-slate-500 hover:bg-white transition-colors relative active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                        aria-label={`알림${unreadCount > 0 ? ` (${unreadCount}건 미읽음)` : ''}`}
                    >
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 size-4 bg-rose-500 text-[10px] text-white font-semibold flex items-center justify-center rounded-full border-2 border-slate-50">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="size-10 flex items-center justify-center overflow-hidden bg-white border border-slate-100 transition-colors active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                        aria-label="프로필 설정"
                    >
                        <User size={20} className="text-slate-400" />
                    </button>
                </div>
            </header>

            <NotificationModal
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
            />
            <UserProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </>
    );
}
