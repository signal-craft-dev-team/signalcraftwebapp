import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
            <div className="mb-6 flex size-20 items-center justify-center bg-slate-100 text-4xl"
                style={{ borderRadius: 'var(--radius-lg)' }}
            >
                🚧
            </div>
            <h1 className="text-slate-900 mb-2">페이지 준비 중입니다</h1>
            <p className="text-slate-500 mb-8 max-w-xs leading-relaxed">
                요청하신 <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">/machines</span> 페이지는 아직 공사 중이에요.
            </p>

            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-signal-blue text-white px-6 py-3 font-medium active:scale-[0.97] transition-transform shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-blue focus-visible:ring-offset-2"
                style={{ borderRadius: 'var(--radius-md)' }}
            >
                <ChevronLeft size={20} />
                홈으로 돌아가기
            </button>
        </div>
    );
}
