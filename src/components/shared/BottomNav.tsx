import { cn } from '../../lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { classTokens } from '@/styles/tokens';
import { MaterialSymbolIcon } from '../ui/MaterialSymbolIcon';

export function BottomNav() {
    const location = useLocation();

    const tabs = [
        { id: 'dashboard', icon: 'dashboard', label: '홈', path: '/dashboard' },
        { id: 'machines', icon: 'precisionManufacturing', label: '설비', path: '/machines' },
        { id: 'reports', icon: 'finance', label: '리포트', path: '/report' },
        { id: 'settings', icon: 'settings', label: '설정', path: '/settings' },
    ] as const;

    return (
        <nav className="fixed bottom-0 w-full bg-white/92 border-t border-slate-100 pb-safe z-50"
            style={{ backdropFilter: 'blur(16px)' }}
            aria-label="메인 네비게이션"
        >
            <div className="flex justify-around items-center h-20 px-2 max-w-lg mx-auto">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <Link
                            key={tab.id}
                            to={tab.path}
                            className="relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                            style={{ borderRadius: 'var(--radius-md)', transitionDuration: 'var(--duration-normal)' }}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "relative z-10 flex flex-col items-center gap-1",
                                    isActive ? classTokens.bottomNav.active : classTokens.bottomNav.inactive
                                )}
                            >
                                <motion.div
                                    animate={isActive ? { y: -2 } : { y: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <MaterialSymbolIcon
                                        name={tab.icon}
                                        size={22}
                                        className="transition-all"
                                        style={{ transitionDuration: 'var(--duration-normal)' }}
                                    />
                                </motion.div>
                                <span className={cn(
                                    "text-[10px] font-semibold tracking-tight",
                                    isActive ? "opacity-100" : "opacity-60"
                                )}>
                                    {tab.label}
                                </span>
                            </motion.div>

                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className={cn("absolute inset-x-2 inset-y-2 z-0", classTokens.bottomNav.activeBg)}
                                    style={{ borderRadius: 'var(--radius-md)' }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
