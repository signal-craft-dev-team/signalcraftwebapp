import type { Machine } from '@/components/features/dashboard/MachineCard';
import type { ClientThemeId } from '@/lib/theme';
import type { DashboardHome } from '@/lib/contracts/dashboardHome';

type DashboardPreset = 'facility-poc' | 'cold-chain' | 'manufacturing';
type DashboardMetricId = 'statusSummary' | 'equipmentSummary' | 'equipmentUsage' | 'machineList';

type NotificationSeed = {
    id: string;
    type: 'alert' | 'report' | 'maintenance';
    title: string;
    message: string;
    isRead: boolean;
    createdHoursAgo?: number;
    createdDaysAgo?: number;
};

type MaintenanceSeed = {
    id: string;
    device_id: string;
    action_type: 'CHECK' | 'CLEANING' | 'PART_REPLACE';
    description: string;
    performedDaysAgo: number;
};

type InsightPeriod = {
    score: number;
    status: string;
    summary: string;
    metrics: Array<{ label: string; value: string; change: string; isGood: boolean }>;
    timeline: Array<{ time: string; event: string; type: 'info' | 'warning' | 'alert' | 'success' }>;
    aiAdvice: string;
};

export const mockScenario = {
    company: {
        id: 'raven',
        name: 'Raven Materials',
        siteLabel: '인천 송도 본사 / 소재 공정 라인',
        domain: 'Black TiO2 visible-light photocatalyst',
        themeId: 'raven' satisfies ClientThemeId,
        dashboardPreset: 'facility-poc' satisfies DashboardPreset,
        enabledMetrics: ['statusSummary', 'equipmentSummary', 'equipmentUsage', 'machineList'] satisfies DashboardMetricId[],
        labels: {
            machine: '설비',
            usage: '장비 사용 상태',
            statusSummary: '설비 상태 요약',
            equipmentSummary: '설비 요약',
        },
    },
    userProfile: {
        email: 'ops@raven-materials.com',
        full_name: 'Raven Materials 운영팀',
        role: '소재 공정 관리자',
    },
    dashboardHome: {
        appVersion: 'v0.0.1',
        lastUpdatedAt: '2026-06-02T08:30:00+09:00',
        maintenancePhone: '010-1234-5678',
        statusOverview: [
            {
                id: 'machines',
                title: '설비 연결 상태',
                state: 'danger',
                healthyCount: 2,
                totalCount: 5,
                description: '현재 설치된 5대 중 1대가 즉시 점검이 필요해요.',
            },
        ],
        equipmentUsage: {
            selectedPeriod: '24h',
            periodOptions: [
                { id: '24h', label: '지난 24시간' },
                { id: '3d', label: '지난 3일' },
                { id: '5d', label: '지난 5일' },
                { id: '7d', label: '지난 7일' },
            ],
            machines: [
                { id: 'chiller-01', name: '냉동칠러 01' },
                { id: 'compressor-01', name: '메인 컴프레서 02' },
                { id: 'vacuum-pump-01', name: '바큠펌프 01' },
                { id: 'vacuum-oven-01', name: '진공오븐 01' },
                { id: 'ahu-01', name: '공조기 01' },
            ],
            segments: [
                { machineId: 'chiller-01', state: 'RUNNING', startedAt: '2026-05-26T00:00:00+09:00', endedAt: '2026-05-27T06:00:00+09:00' },
                { machineId: 'chiller-01', state: 'OFF', startedAt: '2026-05-27T06:00:00+09:00', endedAt: '2026-05-27T18:00:00+09:00' },
                { machineId: 'chiller-01', state: 'RUNNING', startedAt: '2026-05-27T18:00:00+09:00', endedAt: '2026-05-30T12:00:00+09:00' },
                { machineId: 'chiller-01', state: 'ERROR', startedAt: '2026-05-30T12:00:00+09:00', endedAt: '2026-05-30T20:00:00+09:00' },
                { machineId: 'chiller-01', state: 'RUNNING', startedAt: '2026-05-30T20:00:00+09:00', endedAt: '2026-06-01T08:00:00+09:00' },
                { machineId: 'chiller-01', state: 'OFF', startedAt: '2026-06-01T08:00:00+09:00', endedAt: '2026-06-01T12:00:00+09:00' },
                { machineId: 'chiller-01', state: 'RUNNING', startedAt: '2026-06-01T12:00:00+09:00', endedAt: '2026-06-01T20:00:00+09:00' },
                { machineId: 'chiller-01', state: 'NO_DATA', startedAt: '2026-06-01T20:00:00+09:00', endedAt: '2026-06-02T00:00:00+09:00' },
                { machineId: 'compressor-01', state: 'RUNNING', startedAt: '2026-05-26T00:00:00+09:00', endedAt: '2026-05-28T10:00:00+09:00' },
                { machineId: 'compressor-01', state: 'ERROR', startedAt: '2026-05-28T10:00:00+09:00', endedAt: '2026-05-28T22:00:00+09:00' },
                { machineId: 'compressor-01', state: 'OFF', startedAt: '2026-05-28T22:00:00+09:00', endedAt: '2026-05-30T06:00:00+09:00' },
                { machineId: 'compressor-01', state: 'RUNNING', startedAt: '2026-05-30T06:00:00+09:00', endedAt: '2026-06-01T00:00:00+09:00' },
                { machineId: 'compressor-01', state: 'ERROR', startedAt: '2026-06-01T00:00:00+09:00', endedAt: '2026-06-01T06:00:00+09:00' },
                { machineId: 'compressor-01', state: 'OFF', startedAt: '2026-06-01T06:00:00+09:00', endedAt: '2026-06-01T10:00:00+09:00' },
                { machineId: 'compressor-01', state: 'ERROR', startedAt: '2026-06-01T10:00:00+09:00', endedAt: '2026-06-01T18:00:00+09:00' },
                { machineId: 'compressor-01', state: 'OFF', startedAt: '2026-06-01T18:00:00+09:00', endedAt: '2026-06-02T00:00:00+09:00' },
                { machineId: 'vacuum-pump-01', state: 'RUNNING', startedAt: '2026-05-26T00:00:00+09:00', endedAt: '2026-05-29T16:00:00+09:00' },
                { machineId: 'vacuum-pump-01', state: 'OFF', startedAt: '2026-05-29T16:00:00+09:00', endedAt: '2026-05-30T04:00:00+09:00' },
                { machineId: 'vacuum-pump-01', state: 'RUNNING', startedAt: '2026-05-30T04:00:00+09:00', endedAt: '2026-06-02T00:00:00+09:00' },
                { machineId: 'vacuum-oven-01', state: 'RUNNING', startedAt: '2026-05-26T00:00:00+09:00', endedAt: '2026-05-27T20:00:00+09:00' },
                { machineId: 'vacuum-oven-01', state: 'OFF', startedAt: '2026-05-27T20:00:00+09:00', endedAt: '2026-05-28T08:00:00+09:00' },
                { machineId: 'vacuum-oven-01', state: 'RUNNING', startedAt: '2026-05-28T08:00:00+09:00', endedAt: '2026-05-31T22:00:00+09:00' },
                { machineId: 'vacuum-oven-01', state: 'OFF', startedAt: '2026-05-31T22:00:00+09:00', endedAt: '2026-06-01T10:00:00+09:00' },
                { machineId: 'vacuum-oven-01', state: 'RUNNING', startedAt: '2026-06-01T10:00:00+09:00', endedAt: '2026-06-01T14:00:00+09:00' },
                { machineId: 'vacuum-oven-01', state: 'OFF', startedAt: '2026-06-01T14:00:00+09:00', endedAt: '2026-06-01T18:00:00+09:00' },
                { machineId: 'vacuum-oven-01', state: 'RUNNING', startedAt: '2026-06-01T18:00:00+09:00', endedAt: '2026-06-02T00:00:00+09:00' },
                { machineId: 'ahu-01', state: 'RUNNING', startedAt: '2026-05-26T00:00:00+09:00', endedAt: '2026-06-02T00:00:00+09:00' },
            ],
            summary: {
                runningMinutes: 960,
                offMinutes: 240,
            },
        },
        equipmentSummary: [
            { id: 'chiller-01', name: '냉동칠러 01', type: 'CHILLER', state: 'OFF' },
            { id: 'compressor-01', name: '메인 컴프레서 02', type: 'COMPRESSOR', state: 'OFF' },
            { id: 'vacuum-pump-01', name: '바큠펌프 01', type: 'VACUUM_PUMP', state: 'RUNNING' },
            { id: 'vacuum-oven-01', name: '진공오븐 01', type: 'VACUUM_OVEN', state: 'RUNNING' },
            { id: 'ahu-01', name: '공조기 01', type: 'AHU', state: 'RUNNING' },
        ],
    } satisfies DashboardHome,
    machines: [
        {
            id: 'chiller-01',
            name: '냉동칠러 01',
            location: '지하 1층 기계실 / 냉동기실',
            status: 'warning',
            health: 64,
            prediction: '응축 압력과 흡입 온도 편차가 함께 상승했어요. 응축기 청소와 냉매량 점검이 필요해요.',
            imageUrl: '',
            type: 'CHILLER',
        },
        {
            id: 'compressor-01',
            name: '메인 컴프레서 02',
            location: '지하 1층 공기압축실',
            status: 'error',
            health: 36,
            prediction: '토출 압력과 진동 RMS가 기준을 벗어났어요. 즉시 점검 대상이에요.',
            imageUrl: '',
            type: 'COMPRESSOR',
        },
        {
            id: 'vacuum-pump-01',
            name: '바큠펌프 01',
            location: '유틸리티동 / 진공 라인 헤더실',
            status: 'running',
            health: 92,
            prediction: '흡입 진공도와 베인 회전 속도가 안정적이에요. 현재 운전 패턴을 유지해 주세요.',
            imageUrl: '',
            type: 'VACUUM_PUMP',
        },
        {
            id: 'vacuum-oven-01',
            name: '진공오븐 01',
            location: '공정실 / 진공 열처리 부스',
            status: 'warning',
            health: 71,
            prediction: '챔버 내부 온도와 진공도 회복 시간이 다소 길어졌어요. 게터/시일 상태 확인이 필요해요.',
            imageUrl: '',
            type: 'VACUUM_OVEN',
        },
        {
            id: 'ahu-01',
            name: '공조기 01',
            location: '옥상 기계실 / AHU-1',
            status: 'running',
            health: 88,
            prediction: '급기 풍량과 차압이 정상 범위예요. 필터 교체 주기만 유지하면 됩니다.',
            imageUrl: '',
            type: 'AHU',
        },
    ] satisfies Machine[],
    notifications: [
        {
            id: 'notif-danger-compressor',
            type: 'alert',
            title: '메인 컴프레서 02 이상 감지',
            message: '토출 압력 상승과 진동 RMS 초과가 동시에 감지됐어요. 즉시 점검을 권장해요.',
            isRead: false,
            createdHoursAgo: 1,
        },
        {
            id: 'notif-warning-chiller',
            type: 'maintenance',
            title: '냉동칠러 01 점검 필요',
            message: '응축 압력이 주의 단계로 올라왔어요. 응축기 청소와 냉매량 확인을 부탁드려요.',
            isRead: false,
            createdHoursAgo: 4,
        },
        {
            id: 'notif-report-raven',
            type: 'report',
            title: 'Raven 공정 AI 리포트 도착',
            message: '5대 중 3대에서 주의 이상의 센서 패턴이 확인됐어요. 조치 우선순위를 확인해 주세요.',
            isRead: true,
            createdDaysAgo: 1,
        },
    ] satisfies NotificationSeed[],
    maintenanceHistory: [
        {
            id: 'mnt-001',
            device_id: 'compressor-01',
            action_type: 'CHECK',
            description: '컴프레서 토출/흡입 압력 게이지와 진동 센서 체결 상태 확인.',
            performedDaysAgo: 1,
        },
        {
            id: 'mnt-002',
            device_id: 'chiller-01',
            action_type: 'CLEANING',
            description: '냉동칠러 응축기 핀 청소 및 온도 프로브 재캘리브레이션 완료.',
            performedDaysAgo: 3,
        },
        {
            id: 'mnt-003',
            device_id: 'vacuum-pump-01',
            action_type: 'PART_REPLACE',
            description: '바큠펌프 베인 예비 부품 교체 및 진공도 회복 시간 확인.',
            performedDaysAgo: 8,
        },
    ] satisfies MaintenanceSeed[],
    report: {
        statusSummary: {
            PASS: '공정 상태가 안정적입니다.',
            WARNING: '품질 편차 주의 신호가 포착되었습니다.',
            FAIL: '공정 정지 위험이 감지되었습니다.',
        },
        energy: {
            label: 'Process Efficiency',
            activeTitle: (saved: number) => `공정 손실 ₩${saved.toLocaleString()} 줄였어요`,
            inactiveTitle: '공정 효율 분석 중',
            description: '전력 부하와 품질 편차를 함께 반영한 예상 절감',
        },
        stats: {
            runtimeLabel: '센서 수집 시간',
            cycleLabel: '공정 배치 횟수',
            cycleUnit: '배치',
        },
    },
    analysis: {
        diagnosticsTitle: '공정 핵심 지표',
        diagnostics: [
            { key: 'comp', label: '열/반응 제어 모듈', goodDetail: '온도 편차와 응답 속도 안정', warnDetail: '온도 편차 상승 추적 필요' },
            { key: 'fan', label: '배기/송풍 모듈', goodDetail: '풍량과 차압 정상 범위', warnDetail: '차압 변동 및 팬 진동 주의' },
            { key: 'valve', label: '코팅/투입 밸브', goodDetail: '유량과 분사 패턴 양호', warnDetail: '유량 불규칙 패턴 감지' },
        ],
        liveSignalTitle: '실시간 설비 진동',
        forecastTitle: '72시간 공정 안정도 예보',
        forecastValueLabel: '예상 안정도',
        forecastFailureLabel: '위험 예상 시점',
        forecastHealthyLabel: '이상 징후 없음',
        forecastHealthyValue: '공정 안정도 확보',
        efficiencyTitle: '공정 효율 리포트',
        primaryMetricLabel: '전력 부하',
        primaryMetricDescription: (saved: number) => `전주 대비 ${Math.round((saved || 8000) / 1200)}% 개선 중`,
        secondaryMetricLabel: '광촉매 활성 지표',
        secondaryMetricUnit: '점',
        secondaryMetricDescription: '600-700nm 구간 VOC 저감률 주의',
        insightLabel: 'AI 공정 인사이트',
    },
    smartLog: {
        title: '센서 수집 요약',
        primaryMetricLabel: '수집 시간',
        secondaryMetricLabel: '공정 배치',
        secondaryMetricUnit: 'Batches',
    },
    aiInsight: {
        cardTitle: '현재 Raven 공정은 주의 관찰 중입니다.',
        cardHighlight: '주의 관찰',
        cardSubtitle: '컴프레서 1대 위험 • 진공오븐 진공도 회복 저하',
        periods: [
            { id: 'daily', label: '일간' },
            { id: 'weekly', label: '주간' },
            { id: 'monthly', label: '월간' },
        ],
        periodData: {
            daily: {
                score: 74,
                status: 'Watch',
                summary: '대부분 설비는 정상 수집 중이나 메인 컴프레서 02에서 즉시 점검 신호가 있어요.',
                metrics: [
                    { label: '공정 안정도', value: '74%', change: '-8%', isGood: false },
                    { label: '유틸리티 가동률', value: '82%', change: '-5%', isGood: false },
                    { label: '이상 감지', value: '3건', change: '+2', isGood: false },
                ],
                timeline: [
                    { time: '09:10', event: '냉동칠러 01 센서 수집 시작', type: 'info' },
                    { time: '13:40', event: '메인 컴프레서 02 토출 압력 상승', type: 'alert' },
                    { time: '17:20', event: '바큠펌프 01 진공도 정상 범위', type: 'success' },
                ],
                aiAdvice: '컴프레서 02를 먼저 점검하고, 진공오븐 01의 게터/시일 상태와 진공도 회복 시간을 다시 확인하는 게 좋아요.',
            },
            weekly: {
                score: 81,
                status: 'Controlled',
                summary: '주간 기준으로는 안정적이지만 컴프레서와 진공오븐 구간에서 반복 신호가 있어요.',
                metrics: [
                    { label: '평균 안정도', value: '81%', change: '-3%', isGood: false },
                    { label: '품질 편차', value: 'Low', change: 'Stable', isGood: true },
                    { label: '점검 권장', value: '2건', change: '+1', isGood: false },
                ],
                timeline: [
                    { time: '월요일', event: '바큠펌프 베인 세정 완료', type: 'success' },
                    { time: '수요일', event: '진공오븐 진공도 회복 시간 5% 증가', type: 'warning' },
                    { time: '금요일', event: '컴프레서 진동 RMS 기준 초과', type: 'alert' },
                ],
                aiAdvice: '컴프레서와 냉동칠러 점검을 같은 창에 묶으면 유틸리티 정지 시간을 줄일 수 있어요.',
            },
            monthly: null,
        } satisfies Record<'daily' | 'weekly' | 'monthly', InsightPeriod | null>,
    },
};
