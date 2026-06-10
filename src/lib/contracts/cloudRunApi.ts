// Cloud Run API contract — SignalCraft Serving API (staging) v0.0.1
// Source: https://v1.api.stag.serving.signalcraft.kr/openapi.json
// 본 파일은 외부 API 응답 타입의 단일 SoT. 변경 시 cloud-run-api-spec.md도 동기화.

export const OPERATIONAL_STATES = ['running', 'stopped', 'error', 'unknown'] as const;
export type OperationalState = (typeof OPERATIONAL_STATES)[number];

export const MACHINE_STATES = [
    'unknown',
    'normal',
    'warning',
    'abnormal',
    'critical',
    'offline',
] as const;
export type MachineState = (typeof MACHINE_STATES)[number];

export const PERIOD_VALUES = ['24h', '3d', '5d', '7d'] as const;
export type PeriodEnum = (typeof PERIOD_VALUES)[number];

export type CloudRunMachineStatus = {
    machine_id: string;
    machine_code: string;
    label: string | null;
    operational_state: OperationalState;
    operational_score: number | null;
    current_state: MachineState;
    remaining_score: number | null;
    active_alerts_count: number;
    sensor_online: boolean;
    updated_at: string;
};

export type CloudRunMachineStatusHistoryPoint = {
    id: string;
    operational_state: OperationalState;
    operational_score: number | null;
    current_state: MachineState;
    recorded_at: string;
};

export type MachinesResponse = {
    machines: CloudRunMachineStatus[];
};

export type MachineDetailResponse = {
    machine_id: string;
    machine_code: string;
    label: string | null;
    place_id: string;
    operational_state: OperationalState;
    operational_score: number | null;
    current_state: MachineState;
    remaining_score: number | null;
    active_alerts_count: number;
    sensor_online: boolean;
    status_updated_at: string | null;
    // recorded_at 내림차순, 최대 5,000건
    machine_status_history: CloudRunMachineStatusHistoryPoint[];
};

export type PlaceMachinesResponse = {
    place_id: string;
    machines: CloudRunMachineStatus[];
};

export type UserInfo = {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    is_active: boolean;
};

export type CustomerInfo = {
    id: string;
    name: string;
    is_active: boolean;
};

export type PlaceInfo = {
    id: string;
    name: string;
    sub_name: string | null;
    address: string | null;
    is_active: boolean;
};

export type TechnicianInfo = {
    id: string;
    name: string;
    phone: string;
    address: string;
    is_primary: boolean;
    is_active: boolean;
};

export type MeResponse = {
    user: UserInfo;
    customer: CustomerInfo;
    places: PlaceInfo[];
    technicians: TechnicianInfo[];
};
