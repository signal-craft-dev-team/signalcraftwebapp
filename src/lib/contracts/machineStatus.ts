export const MACHINE_STATUS = ['running', 'warning', 'error'] as const;

export type MachineStatus = (typeof MACHINE_STATUS)[number];

export type DeviceStatusRaw = 'GOOD' | 'WARNING' | 'DANGER';

export const DEVICE_STATUS_TO_MACHINE_STATUS = {
    GOOD: 'running',
    WARNING: 'warning',
    DANGER: 'error',
} as const satisfies Record<DeviceStatusRaw, MachineStatus>;
