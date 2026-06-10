import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, Search, Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { classTokens } from '@/styles/tokens';

interface HistoryViewProps {
    deviceId: string | null;
    onSelectDate: (date: string) => void;
}

interface DailyReport {
    id: string;
    report_date: string;
    health_score: number;
    ai_summary: string;
    haccp_status: string;
}

const getHaccpHistoryClass = (status: string) => {
    if (status === 'PASS') return classTokens.haccpStatus.PASS.history;
    if (status === 'WARNING') return classTokens.haccpStatus.WARNING.history;
    return classTokens.haccpStatus.FAIL.history;
};

export function HistoryView({ deviceId, onSelectDate }: HistoryViewProps) {
    const { data: historyData, isLoading, error } = useQuery<{ reports: DailyReport[] }>({
        queryKey: QUERY_KEYS.reportsHistory(deviceId),
        queryFn: async () => {
            if (!deviceId) return { reports: [] };
            const response = await apiFetch(`/reports/?device_id=${deviceId}`);
            if (!response.ok) throw new Error('히스토리 로드 실패');
            return response.json();
        },
        enabled: !!deviceId,
    });

    const reports = historyData?.reports || [];

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-6"
        >
            {/* Search / Filter */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="날짜 또는 키워드 검색"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none focus:ring-2 focus:ring-signal-blue/20 font-medium text-sm text-slate-600"
                    style={{ borderRadius: 'var(--radius-md)' }}
                />
            </div>

            {/* List */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                        <Loader2 className="size-8 animate-spin" />
                        <p className="font-medium">기록을 불러오고 있습니다...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-rose-500 font-medium bg-rose-50" style={{ borderRadius: 'var(--radius-md)' }}>
                        불러오기 실패
                    </div>
                ) : reports.length === 0 ? (
                    <div className="py-20 text-center bg-white border border-dashed border-slate-200" style={{ borderRadius: 'var(--radius-lg)' }}>
                        <p className="font-medium text-slate-400">리포트 기록이 없습니다.</p>
                    </div>
                ) : (
                    reports.map((report) => (
                        <button
                            key={report.id}
                            onClick={() => onSelectDate(report.report_date)}
                            className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 hover:border-signal-blue/30 hover:shadow-card-hover transition-all active:scale-[0.98] group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                            style={{ borderRadius: 'var(--radius-lg)' }}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "size-14 flex flex-col items-center justify-center font-semibold",
                                    getHaccpHistoryClass(report.haccp_status)
                                )} style={{ borderRadius: 'var(--radius-md)' }}>
                                    <span className="text-[10px] uppercase mb-0.5">{report.health_score}%</span>
                                    <Calendar size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {new Date(report.report_date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 리포트
                                    </h4>
                                    <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-1">{report.ai_summary}</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-slate-300 group-hover:text-signal-blue transition-colors" />
                        </button>
                    ))
                )}
            </div>
        </motion.div>
    );
}
