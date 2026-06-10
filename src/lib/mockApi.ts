import type { Machine } from '@/components/features/dashboard/MachineCard';
import { mockScenario } from './mockScenario';
import { getRuntimeConfigValue } from './runtimeConfig';
import type {
    CloudRunMachineStatus,
    CloudRunMachineStatusHistoryPoint,
    MachineDetailResponse,
    MachineState,
    MachinesResponse,
    MeResponse,
    OperationalState,
    PlaceMachinesResponse,
    PeriodEnum,
} from './contracts/cloudRunApi';
import { PERIOD_VALUES } from './contracts/cloudRunApi';

type NotificationSettings = {
    push_enabled: boolean;
    kakao_enabled: boolean;
    anomaly_alerts: boolean;
    report_alerts: boolean;
    push_token?: string;
};

type MockNotification = {
    id: string;
    type: 'alert' | 'report' | 'maintenance';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

const now = new Date();
const isoHoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
const isoDaysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
const isoDaysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

export const isMockApiEnabled = () => {
    const flag = getRuntimeConfigValue('VITE_USE_MOCK_API');
    return flag !== 'false';
};

// 백엔드 엔드포인트가 신 staging에서 활성화되는 순서대로 아래 set에 path 추가.
// 추가된 path는 mock을 건너뛰고 실 API로 fall-through 됨 → 점진 전환.
// 비교는 정확한 path 매칭 (query string 제외). prefix/sub-path 자동 포함 X:
//   - '/notifications/' 만 set 에 있으면 '/notifications/123/read' 는 여전히 mock 사용.
//   - sub-path도 전환하려면 별도 명시 또는 path 패턴 매칭 로직 확장 필요.
// 예) 알림 메인 활성화: '/notifications/' 만 추가하면 목록만 실 API.
const ENDPOINTS_DISABLED_IN_MOCK = new Set<string>([
    // 백엔드 완성 순서대로 주석 해제:
    // '/notifications/',
    // '/notifications/settings',
    // '/reports/',
    // '/dashboard/home',
]);

export const isMockApiEnabledForEndpoint = (path: string): boolean => {
    if (!isMockApiEnabled()) return false;
    return !ENDPOINTS_DISABLED_IN_MOCK.has(path);
};

const machines: Machine[] = mockScenario.machines;

let notificationSettings: NotificationSettings = {
    push_enabled: true,
    kakao_enabled: true,
    anomaly_alerts: true,
    report_alerts: true,
    push_token: 'dev-mock-token',
};

let notifications: MockNotification[] = mockScenario.notifications.map((notification) => ({
    ...notification,
    createdAt: notification.createdDaysAgo
        ? isoDaysAgo(notification.createdDaysAgo)
        : isoHoursAgo(notification.createdHoursAgo || 1),
}));

let maintenanceHistory = mockScenario.maintenanceHistory.map(({ performedDaysAgo, ...record }) => ({
    ...record,
    performed_at: isoDaysAgo(performedDaysAgo),
}));

const jsonResponse = (data: unknown, init?: ResponseInit) =>
    new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        ...init,
    });

const readBody = async (init?: RequestInit) => {
    if (!init?.body || typeof init.body !== 'string') return {};
    try {
        return JSON.parse(init.body);
    } catch {
        return {};
    }
};

const machineById = (id: string | null) => machines.find((machine) => machine.id === id) || machines[0];

const STATUS_TO_OPERATIONAL: Record<Machine['status'], OperationalState> = {
    running: 'running',
    warning: 'running',
    error: 'error',
};

const STATUS_TO_CURRENT: Record<Machine['status'], MachineState> = {
    running: 'normal',
    warning: 'warning',
    error: 'critical',
};

const MOCK_PLACE_ID = '00000000-0000-0000-0000-000000000010';

const toCloudRunMachine = (m: Machine): CloudRunMachineStatus => ({
    machine_id: m.id,
    machine_code: m.type,
    label: m.name,
    operational_state: STATUS_TO_OPERATIONAL[m.status],
    operational_score: m.health,
    current_state: STATUS_TO_CURRENT[m.status],
    remaining_score: null,
    active_alerts_count: m.status === 'error' ? 1 : 0,
    sensor_online: m.status !== 'error',
    updated_at: now.toISOString(),
});

const HISTORY_POINTS_BY_PERIOD: Record<PeriodEnum, number> = {
    '24h': 24,
    '3d': 36,
    '5d': 60,
    '7d': 84,
};

const isPeriodEnum = (value: string | null): value is PeriodEnum =>
    value !== null && (PERIOD_VALUES as readonly string[]).includes(value);

const buildHistoryForMachine = (
    m: Machine,
    period: PeriodEnum
): CloudRunMachineStatusHistoryPoint[] => {
    const count = HISTORY_POINTS_BY_PERIOD[period];
    const baseOpScore = STATUS_TO_OPERATIONAL[m.status] === 'running' ? 0.9 : 0.4;
    const points: CloudRunMachineStatusHistoryPoint[] = [];

    for (let i = 0; i < count; i += 1) {
        const drift = ((i % 5) - 2) * 0.02;
        points.push({
            id: `history-${m.id}-${i}`,
            operational_state: STATUS_TO_OPERATIONAL[m.status],
            operational_score: Math.max(0, Math.min(1, baseOpScore + drift)),
            current_state: STATUS_TO_CURRENT[m.status],
            recorded_at: isoHoursAgo(i),
        });
    }

    return points;
};

const toMachineDetail = (m: Machine, period: PeriodEnum): MachineDetailResponse => ({
    machine_id: m.id,
    machine_code: m.type,
    label: m.name,
    place_id: MOCK_PLACE_ID,
    operational_state: STATUS_TO_OPERATIONAL[m.status],
    operational_score: m.health,
    current_state: STATUS_TO_CURRENT[m.status],
    remaining_score: null,
    active_alerts_count: m.status === 'error' ? 1 : 0,
    sensor_online: m.status !== 'error',
    status_updated_at: now.toISOString(),
    machine_status_history: buildHistoryForMachine(m, period),
});

const buildMeResponse = (): MeResponse => ({
    user: {
        id: '00000000-0000-0000-0000-000000000001',
        email: mockScenario.userProfile.email,
        name: mockScenario.userProfile.full_name,
        phone: '010-0000-0000',
        role: mockScenario.userProfile.role,
        is_active: true,
    },
    customer: {
        id: '12d5e33c-405a-4856-bf8e-51fc899c1737',
        name: mockScenario.company.name,
        is_active: true,
    },
    places: [
        {
            id: MOCK_PLACE_ID,
            name: mockScenario.company.siteLabel,
            sub_name: null,
            address: null,
            is_active: true,
        },
    ],
    technicians: [
        {
            id: '00000000-0000-0000-0000-000000000020',
            name: '담당 기술자',
            phone: '010-1234-5678',
            address: '',
            is_primary: true,
            is_active: true,
        },
    ],
});

const reportForMachine = (machine: Machine, dayOffset = 0) => {
    const health = Math.max(20, machine.health - dayOffset * 2);
    const isDanger = machine.status === 'error' || health < 50;
    const isWarning = machine.status === 'warning' || health < 75;

    return {
        id: `report-${machine.id}-${dayOffset}`,
        report_date: isoDaysAgo(dayOffset || 0),
        device_id: machine.id,
        total_runtime: isDanger ? 1210 : isWarning ? 1295 : 1360,
        cycle_count: isDanger ? 28 : isWarning ? 22 : 14,
        health_score: health,
        roi_data: { saved: isDanger ? 0 : 126000, watt: isDanger ? 74.8 : isWarning ? 61.2 : 48.6, door_opens: isDanger ? 57 : isWarning ? 76 : 91 },
        diagnostics: {
            comp: isDanger ? 42 : isWarning ? 67 : 95,
            fan: isDanger ? 39 : isWarning ? 73 : 91,
            valve: isDanger ? 54 : isWarning ? 80 : 93,
        },
        ai_summary: machine.prediction,
        haccp_status: isDanger ? 'FAIL' : isWarning ? 'WARNING' : 'PASS',
        created_at: isoHoursAgo(2),
    };
};

const reportsForMachine = (machine: Machine) =>
    Array.from({ length: 10 }, (_, index) => reportForMachine(machine, index));

const analysisForMachine = (machine: Machine) => {
    const report = reportForMachine(machine);
    const decay = machine.status === 'error' ? [38, 32, 27, 21] : machine.status === 'warning' ? [62, 55, 47, 40] : [91, 90, 88, 87];

    return {
        report,
        forecast: {
            id: `forecast-${machine.id}`,
            device_id: machine.id,
            golden_time: machine.status === 'running' ? null : isoDaysFromNow(machine.status === 'error' ? 1 : 3),
            prediction_data: [
                { time: '현재', value: decay[0] },
                { time: '1일 뒤', value: decay[1] },
                { time: '2일 뒤', value: decay[2] },
                { time: '3일 뒤', value: decay[3] },
            ],
        },
    };
};

const logsForMachine = (machine: Machine) => [
    {
        id: `log-${machine.id}-1`,
        occurred_at: isoHoursAgo(1),
        event_type: machine.status === 'error' ? 'OFF' : 'ON',
        status: machine.status === 'error' ? '위험 신호' : '센서 수집 중',
        details: machine.status === 'running' ? '온도/진동/차압 정상 범위' : '온도 drift와 진동 RMS 기준치 초과',
    },
    {
        id: `log-${machine.id}-2`,
        occurred_at: isoHoursAgo(3),
        event_type: 'DEF',
        status: '공정 배치 기록',
        details: machine.status === 'running' ? '배치 종료 후 품질 지표 정상' : '가시광 조사/배기 조건 재확인 필요',
    },
    {
        id: `log-${machine.id}-3`,
        occurred_at: isoHoursAgo(6),
        event_type: 'ON',
        status: '센서 동기화',
        details: '온도, 진동, VOC, 차압 데이터 수집 재개',
    },
];

export async function mockApiFetch(path: string, init?: RequestInit): Promise<Response> {
    const url = new URL(path, 'https://signalcraft.dev');
    const method = init?.method?.toUpperCase() || 'GET';
    const body = await readBody(init);

    if (url.pathname === '/machines' || url.pathname === '/machines/') {
        const payload: MachinesResponse = {
            machines: machines.map(toCloudRunMachine),
        };
        return jsonResponse(payload);
    }

    const machineDetailMatch = url.pathname.match(/^\/machines\/([^/]+)\/?$/);
    if (machineDetailMatch) {
        const rawPeriod = url.searchParams.get('period');
        if (!isPeriodEnum(rawPeriod)) {
            return jsonResponse(
                { detail: "period 쿼리는 '24h' | '3d' | '5d' | '7d' 중 하나여야 합니다." },
                { status: 422 }
            );
        }
        const machine = machines.find((m) => m.id === machineDetailMatch[1]);
        if (!machine) {
            return jsonResponse(
                { detail: '해당 머신을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }
        return jsonResponse(toMachineDetail(machine, rawPeriod));
    }

    const placeMachinesMatch = url.pathname.match(/^\/places\/([^/]+)\/machines\/?$/);
    if (placeMachinesMatch) {
        const placeId = placeMachinesMatch[1];
        if (placeId !== MOCK_PLACE_ID) {
            return jsonResponse(
                { detail: '해당 현장을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }
        const payload: PlaceMachinesResponse = {
            place_id: placeId,
            machines: machines.map(toCloudRunMachine),
        };
        return jsonResponse(payload);
    }

    if (url.pathname === '/me') {
        return jsonResponse(buildMeResponse());
    }

    if (url.pathname === '/health') {
        return jsonResponse({});
    }

    if (url.pathname === '/dashboard/home') {
        return jsonResponse(mockScenario.dashboardHome);
    }

    if (url.pathname === '/dashboard/equipment-usage') {
        const period = url.searchParams.get('period') || '24h';
        const machineId = url.searchParams.get('machine_id');
        const base = mockScenario.dashboardHome.equipmentUsage;
        const segments = machineId
            ? base.segments.filter((segment) => segment.machineId === machineId)
            : base.segments;
        return jsonResponse({
            ...base,
            selectedPeriod: period,
            segments,
        });
    }

    if (url.pathname === '/notifications/settings') {
        if (method === 'POST') {
            notificationSettings = { ...notificationSettings, ...body };
        }
        return jsonResponse(notificationSettings);
    }

    if (url.pathname === '/notifications/') {
        return jsonResponse({ notifications });
    }

    if (url.pathname.startsWith('/notifications/') && url.pathname.endsWith('/read')) {
        const id = url.pathname.split('/')[2];
        notifications = notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification
        );
        return jsonResponse({ ok: true });
    }

    if (url.pathname === '/notifications/mark-all-read') {
        notifications = notifications.map((notification) => ({ ...notification, isRead: true }));
        return jsonResponse({ ok: true });
    }

    if (url.pathname === '/dashboard/machine-detail/analysis') {
        return jsonResponse(analysisForMachine(machineById(url.searchParams.get('machine_id'))));
    }

    if (url.pathname === '/dashboard/machine-detail/smart-log') {
        return jsonResponse(logsForMachine(machineById(url.searchParams.get('machine_id'))));
    }

    if (url.pathname === '/dashboard/machine-detail/maintenance') {
        if (method === 'POST') {
            const record = {
                id: `mnt-${Date.now()}`,
                ...body,
                performed_at: body.performed_at || new Date().toISOString(),
            };
            maintenanceHistory = [record, ...maintenanceHistory];
            return jsonResponse(record);
        }

        const machineId = url.searchParams.get('machine_id');
        return jsonResponse(
            maintenanceHistory.filter((record) => !machineId || record.device_id === machineId)
        );
    }

    if (url.pathname === '/dashboard/machine-detail/service-tickets') {
        return jsonResponse({ id: `ticket-${Date.now()}`, status: 'received', ...body });
    }

    if (url.pathname.startsWith('/reports/latest/')) {
        const id = url.pathname.split('/').pop() || null;
        return jsonResponse(reportForMachine(machineById(id)));
    }

    if (url.pathname === '/reports/') {
        return jsonResponse({ reports: reportsForMachine(machineById(url.searchParams.get('device_id'))) });
    }

    return jsonResponse({ message: `No mock route for ${url.pathname}` }, { status: 404 });
}
