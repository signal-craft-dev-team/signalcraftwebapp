import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, CreditCard, LogOut, ShieldCheck, Moon } from 'lucide-react';
import { Button } from '../../ui/Button';
import { ProfileHeader } from './ProfileHeader';
import { MenuItem } from './MenuItem';
import { SubscriptionDetail } from './SubscriptionDetail';
import { AppSettings } from './AppSettings';
import { classTokens } from '@/styles/tokens';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ModalView = 'main' | 'subscription' | 'appearance' | 'security';

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
    const [view, setView] = useState<ModalView>('main');

    const handleClose = () => {
        onClose();
        setTimeout(() => setView('main'), 300);
    };

    const mainItems = [
        { id: 'account', label: '계정 설정', icon: Settings, color: classTokens.profileMenu.account },
        { id: 'subscription', label: '구독 관리', icon: CreditCard, color: classTokens.profileMenu.subscription, onClick: () => setView('subscription') },
        { id: 'security', label: '보안 및 인증', icon: ShieldCheck, color: classTokens.profileMenu.security, onClick: () => setView('security') },
        { id: 'appearance', label: '화면 테마', icon: Moon, color: classTokens.profileMenu.appearance, right: '라이트', onClick: () => setView('appearance') },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-slate-900/40 z-[100]"
                        style={{ backdropFilter: 'blur(4px)' }}
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        onClick={(e) => e.stopPropagation()}
                        className="fixed inset-x-0 bottom-0 bg-white z-[101] shadow-2xl p-6 pb-12 flex flex-col max-h-[90vh] min-h-[60vh]"
                        style={{ borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}
                    >
                        <AnimatePresence mode="wait">
                            {view === 'main' && (
                                <motion.div
                                    key="main"
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 16 }}
                                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                                    className="flex-1 flex flex-col"
                                >
                                    <ProfileHeader onClose={handleClose} />

                                    <div className="space-y-3 mb-10">
                                        {mainItems.map((item) => (
                                            <MenuItem
                                                key={item.id}
                                                id={item.id}
                                                label={item.label}
                                                icon={item.icon}
                                                color={item.color}
                                                right={item.right}
                                                onClick={item.onClick || (() => { })}
                                            />
                                        ))}
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="w-full h-14 text-slate-400 hover:text-rose-500 hover:bg-rose-50 border-none font-medium gap-2 transition-all mt-auto bg-slate-50"
                                        style={{ borderRadius: 'var(--radius-md)' }}
                                    >
                                        <LogOut size={20} />
                                        로그아웃
                                    </Button>
                                </motion.div>
                            )}

                            {view === 'subscription' && (
                                <SubscriptionDetail key="subscription" onBack={() => setView('main')} />
                            )}

                            {view === 'appearance' && (
                                <AppSettings key="appearance" onBack={() => setView('main')} />
                            )}

                            {view === 'security' && (
                                <motion.div
                                    key="security"
                                    className="flex-1 flex items-center justify-center flex-col text-slate-400 gap-4"
                                >
                                    <ShieldCheck size={64} className="opacity-20 translate-y-[-20%]" />
                                    <p className="font-medium">보안 설정은 준비 중입니다.</p>
                                    <Button variant="secondary" onClick={() => setView('main')}>돌아가기</Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
