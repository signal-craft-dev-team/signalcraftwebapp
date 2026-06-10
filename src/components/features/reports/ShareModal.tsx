import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Image as ImageIcon, MessageCircle, Check, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { exportToPdf, exportToImage } from '../../../lib/utils/exportUtils';
import { brandTokens } from '@/styles/tokens';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportDate: string;
}

export function ShareModal({ isOpen, onClose, reportDate }: ShareModalProps) {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportType, setExportType] = useState<'pdf' | 'image' | null>(null);

    const showToast = (message: string, type: 'success' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleShare = async (id: string, label: string) => {
        if (id === 'link') {
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast('링크가 클립보드에 복사되었습니다.');
            } catch (err) {
                showToast('링크 복사에 실패했습니다.', 'info');
            }
        } else if (id === 'pdf' || id === 'image') {
            try {
                setIsExporting(true);
                setExportType(id as 'pdf' | 'image');
                const cleanDate = reportDate.replace(/\s/g, '_');

                if (id === 'pdf') {
                    await exportToPdf('report-content', `SignalCraft_Report_${cleanDate}.pdf`);
                } else {
                    await exportToImage('report-content', `SignalCraft_Report_${cleanDate}.png`);
                }

                showToast(`${id.toUpperCase()} 파일이 생성되었습니다.`);
                onClose();
            } catch (err) {
                console.error(err);
                showToast(`${id.toUpperCase()} 생성에 실패했습니다.`, 'info');
            } finally {
                setIsExporting(false);
                setExportType(null);
            }
        } else {
            showToast(`${label} 기능을 준비 중입니다.`, 'info');
        }
    };

    const shareOptions = [
        { id: 'kakao', label: '카카오톡', icon: MessageCircle, color: `${brandTokens.kakao.bgClass} ${brandTokens.kakao.textClass}` },
        { id: 'image', label: '이미지로 저장', icon: ImageIcon, color: 'bg-emerald-50 text-emerald-600' },
        { id: 'pdf', label: 'PDF 내보내기', icon: Download, color: 'bg-rose-50 text-rose-600' },
        { id: 'link', label: '링크 복사', icon: Copy, color: 'bg-blue-50 text-blue-600' },
    ];

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

                    <AnimatePresence>
                        {toast && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 20 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 bg-slate-900 text-white shadow-xl flex items-center gap-3"
                                style={{ borderRadius: 'var(--radius-md)' }}
                            >
                                {toast.type === 'success' && <div className="size-5 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check size={12} strokeWidth={4} /></div>}
                                <span className="text-sm font-medium">{toast.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 bg-white z-[101] shadow-2xl p-6 pb-12"
                        style={{ borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>리포트 공유하기</h3>
                                <p className="text-sm text-slate-400 font-medium">{reportDate} 건강 리포트</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue"
                                aria-label="닫기"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {shareOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleShare(option.id, option.label)}
                                    disabled={isExporting}
                                    className={cn(
                                        "flex flex-col items-center gap-3 p-6 bg-slate-50 hover:bg-slate-100 transition-all active:scale-[0.97] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2",
                                        isExporting && "opacity-50 cursor-not-allowed"
                                    )}
                                    style={{ borderRadius: 'var(--radius-lg)' }}
                                >
                                    <div className={cn(
                                        "p-4 transition-transform",
                                        option.color,
                                        !isExporting && "group-hover:scale-105"
                                    )} style={{ borderRadius: 'var(--radius-md)' }}>
                                        {isExporting && exportType === option.id ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : (
                                            <option.icon size={24} />
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
