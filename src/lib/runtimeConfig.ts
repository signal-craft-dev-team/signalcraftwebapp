type RuntimeConfigKey =
    | 'VITE_API_URL'
    | 'VITE_APP_TITLE'
    | 'VITE_CLIENT_THEME_ID'
    | 'VITE_SUPABASE_URL'
    | 'VITE_SUPABASE_ANON_KEY'
    | 'VITE_USE_MOCK_API'
    | 'VITE_X_AUTH_ID'
    | 'VITE_X_AUTH_PROVIDER'
    | 'VITE_X_CUSTOMER_ID'
    | 'VITE_PLACE_ID';

export type SignalCraftRuntimeConfig = Partial<Record<RuntimeConfigKey, string>>;

const getWindowConfig = (): SignalCraftRuntimeConfig => {
    if (typeof window === 'undefined') return {};
    return window.__SIGNALCRAFT_CONFIG__ || {};
};

export const getRuntimeConfigValue = (key: RuntimeConfigKey): string | undefined => {
    const runtimeValue = getWindowConfig()[key];
    if (runtimeValue !== undefined && runtimeValue !== '') return runtimeValue;

    return import.meta.env[key];
};
