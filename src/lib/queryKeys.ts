// QUERY_KEYS — TanStack Query 키 단일 팩토리.
// Cloud Run 활성 / mock-only 구분은 주석으로 명시.

export const QUERY_KEYS = {
    // ── Cloud Run 활성 ──────────────────────────────
    machines: ['machines'] as const, // GET /machines
    userProfile: ['user', 'profile'] as const, // GET /me
    machineDetail: (machineId: string, period: string) =>
        ['machine-detail', machineId, period] as const, // GET /machines/{id}?period=
    placeMachines: (placeId: string) =>
        ['places', placeId, 'machines'] as const, // GET /places/{place_id}/machines

    // ── Mock 전용 (Cloud Run 미제공) ────────────────
    notifications: ['notifications'] as const,
    notificationSettings: ['settings', 'notifications'] as const,
    dashboardHome: ['dashboard', 'home'] as const,
    equipmentUsage: (period: string, machineId?: string) =>
        ['dashboard', 'equipment-usage', period, machineId ?? null] as const,
    machineAnalysis: (machineId: string) => ['machine-analysis', machineId] as const,
    machineSmartLogs: (machineId: string) => ['machine-smart-logs', machineId] as const,
    maintenanceHistory: (machineId: string) => ['maintenance-history', machineId] as const,
    reportsLatest: (deviceId: string | null) => ['reports', 'latest', deviceId] as const,
    reportsTrend: (deviceId: string | null) => ['reports', 'trend', deviceId] as const,
    reportsHistory: (deviceId: string | null) => ['reports', 'history', deviceId] as const,
} as const;
