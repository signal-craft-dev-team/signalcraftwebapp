// Cloud Run 6-state(MachineState) + 4-state(OperationalState) → 내부 3-state(MachineStatus) 매핑.
// 이후 6-state 전체를 UI에 노출하기로 결정하면 본 파일만 손대면 됨.

import type { Machine } from '@/components/features/dashboard/MachineCard';
import type { MachineStatus } from './machineStatus';
import type {
    CloudRunMachineStatus,
    MachineState,
    OperationalState,
} from './cloudRunApi';

const HEALTH_FROM_OPERATIONAL: Record<MachineState, number> = {
    normal: 95,
    warning: 65,
    abnormal: 40,
    critical: 25,
    offline: 0,
    unknown: 80,
};

const PREDICTION_MESSAGE: Record<MachineState, string> = {
    normal: '정상 가동 중이에요.',
    warning: '주의 신호가 감지됐어요.',
    abnormal: '비정상 패턴이 보여요. 점검이 필요해요.',
    critical: '위험 상태예요. 즉시 점검하세요.',
    offline: '센서 연결이 끊겼어요.',
    unknown: '상태 정보가 부족해요.',
};

export const toLegacyMachineStatus = (params: {
    operational_state: OperationalState;
    current_state: MachineState;
    sensor_online: boolean;
}): MachineStatus => {
    const { operational_state, current_state, sensor_online } = params;

    if (!sensor_online || current_state === 'offline') return 'error';
    if (current_state === 'critical' || current_state === 'abnormal') return 'error';
    if (operational_state === 'error') return 'error';
    if (current_state === 'warning') return 'warning';
    if (current_state === 'normal' && operational_state === 'running') return 'running';
    return 'warning';
};

export const cloudRunMachineToMachine = (raw: CloudRunMachineStatus): Machine => {
    const status = toLegacyMachineStatus({
        operational_state: raw.operational_state,
        current_state: raw.current_state,
        sensor_online: raw.sensor_online,
    });

    // operational_score = 운전 건강도. remaining_score는 "남은 수명" 의미라
    // health 표시에 부적합 — current_state 기반 fallback이 더 정직.
    const health = raw.operational_score ?? HEALTH_FROM_OPERATIONAL[raw.current_state];

    return {
        id: raw.machine_id,
        name: raw.label ?? raw.machine_code,
        location: '',
        status,
        health: Math.round(Math.max(0, Math.min(100, health))),
        prediction: PREDICTION_MESSAGE[raw.current_state],
        imageUrl: '',
        type: raw.machine_code,
    };
};
