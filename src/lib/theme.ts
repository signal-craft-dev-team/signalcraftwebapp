export const CLIENT_THEME_IDS = ['signalcraft', 'raven'] as const;

export type ClientThemeId = (typeof CLIENT_THEME_IDS)[number];

export const DEFAULT_CLIENT_THEME_ID: ClientThemeId = 'signalcraft';

export function resolveClientTheme(themeId?: string): ClientThemeId {
    return CLIENT_THEME_IDS.includes(themeId as ClientThemeId)
        ? (themeId as ClientThemeId)
        : DEFAULT_CLIENT_THEME_ID;
}

export function applyClientTheme(themeId?: string) {
    document.documentElement.dataset.theme = resolveClientTheme(themeId);
}
