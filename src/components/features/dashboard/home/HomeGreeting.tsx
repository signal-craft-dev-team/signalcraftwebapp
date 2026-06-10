import { classTokens, cssVars } from '@/styles/tokens';

interface HomeGreetingProps {
    fullName: string;
    lastUpdatedAt: string;
}

function formatRelativeTime(iso: string): string {
    const target = new Date(iso).getTime();
    if (Number.isNaN(target)) return '방금 전';
    const diffMs = Date.now() - target;
    const diffMin = Math.round(diffMs / 60000);

    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.round(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    const diffDay = Math.round(diffHour / 24);
    return `${diffDay}일 전`;
}

export function HomeGreeting({ fullName, lastUpdatedAt }: HomeGreetingProps) {
    return (
        <section className="px-6 mb-6">
            <p className={`${classTokens.text.subtle} text-sm font-medium mb-1`}>
                안녕하세요, {fullName} 님
            </p>
            <h2
                className={`${classTokens.text.primary} text-2xl font-bold`}
                style={{ fontFamily: cssVars.fontHeading }}
            >
                좋은 하루 보내고 있어요 👋
            </h2>
            <p className={`${classTokens.text.muted} text-xs mt-2`}>
                마지막 업데이트 {formatRelativeTime(lastUpdatedAt)}
            </p>
        </section>
    );
}
