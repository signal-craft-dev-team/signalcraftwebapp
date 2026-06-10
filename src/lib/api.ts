import { isMockApiEnabledForEndpoint, mockApiFetch } from './mockApi';
import { getRuntimeConfigValue } from './runtimeConfig';

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const buildAuthHeaders = (): Record<string, string> => {
    const authId = getRuntimeConfigValue('VITE_X_AUTH_ID');
    const provider = getRuntimeConfigValue('VITE_X_AUTH_PROVIDER');
    const customerId = getRuntimeConfigValue('VITE_X_CUSTOMER_ID');

    if (!authId || !provider || !customerId) {
        throw new Error(
            'Cloud Run 인증 헤더 env가 설정되지 않았습니다. ' +
                'VITE_X_AUTH_ID / VITE_X_AUTH_PROVIDER / VITE_X_CUSTOMER_ID 확인 필요.'
        );
    }

    return {
        'X-Auth-Id': authId,
        'X-Auth-Provider': provider,
        'X-Customer-ID': customerId,
    };
};

const PUBLIC_PATHS = new Set(['/health']);

const mergeHeaders = (base: Record<string, string>, override?: HeadersInit): HeadersInit => {
    if (!override) return base;
    const merged = new Headers(base);
    new Headers(override).forEach((value, key) => merged.set(key, value));
    return merged;
};

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
    const normalizedPath = normalizePath(path);

    if (isMockApiEnabledForEndpoint(normalizedPath)) {
        return mockApiFetch(normalizedPath, init);
    }

    const baseUrl = getRuntimeConfigValue('VITE_API_URL');
    if (!baseUrl) {
        throw new Error('VITE_API_URL이 설정되지 않았습니다.');
    }

    const needsAuth = !PUBLIC_PATHS.has(normalizedPath);
    const headers = needsAuth
        ? mergeHeaders(buildAuthHeaders(), init?.headers)
        : init?.headers;

    return fetch(`${baseUrl.replace(/\/$/, '')}${normalizedPath}`, {
        ...init,
        headers,
    });
}
