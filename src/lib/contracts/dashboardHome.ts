export const EQUIPMENT_RUN_STATES = ['RUNNING', 'OFF', 'ERROR', 'NO_DATA'] as const;
export type EquipmentRunState = (typeof EQUIPMENT_RUN_STATES)[number];

export const HOME_STATUS_KINDS = ['healthy', 'warning', 'danger'] as const;
export type HomeStatusKind = (typeof HOME_STATUS_KINDS)[number];

export const HOME_PERIODS = ['24h', '3d', '5d', '7d'] as const;
export type HomePeriod = (typeof HOME_PERIODS)[number];

export const STATUS_OVERVIEW_IDS = ['machines', 'edgeSensors', 'server'] as const;
export type StatusOverviewId = (typeof STATUS_OVERVIEW_IDS)[number];

export type StatusOverviewCard = {
    id: StatusOverviewId;
    title: string;
    state: HomeStatusKind;
    healthyCount: number;
    totalCount: number;
    description: string;
};

export type GanttSegment = {
    machineId: string;
    state: EquipmentRunState;
    startedAt: string;
    endedAt: string;
};

export type EquipmentUsageData = {
    selectedPeriod: HomePeriod;
    periodOptions: Array<{ id: HomePeriod; label: string }>;
    machines: Array<{ id: string; name: string }>;
    segments: GanttSegment[];
    summary: {
        runningMinutes: number;
        offMinutes: number;
    };
};

export const EQUIPMENT_SUMMARY_STATES = ['RUNNING', 'OFF'] as const;
export type EquipmentSummaryState = (typeof EQUIPMENT_SUMMARY_STATES)[number];

export type EquipmentSummaryItem = {
    id: string;
    name: string;
    type: string;
    state: EquipmentSummaryState;
};

export type DashboardHome = {
    appVersion: string;
    lastUpdatedAt: string;
    maintenancePhone: string;
    statusOverview: StatusOverviewCard[];
    equipmentUsage: EquipmentUsageData;
    equipmentSummary: EquipmentSummaryItem[];
};
