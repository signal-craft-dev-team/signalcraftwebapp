/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_CLIENT_THEME_ID?: string;
    readonly VITE_USE_MOCK_API?: string;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_X_AUTH_ID?: string;
    readonly VITE_X_AUTH_PROVIDER?: string;
    readonly VITE_X_CUSTOMER_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface Window {
    __SIGNALCRAFT_CONFIG__?: import('./lib/runtimeConfig').SignalCraftRuntimeConfig;
}
