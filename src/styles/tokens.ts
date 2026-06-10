// SignalCraft shared design tokens.
// Prefer importing these tokens for chart colors, inline styles, and non-Tailwind values.

import type { CSSProperties } from 'react';

export const colors = {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    card: 'var(--card)',
    primary: 'var(--primary)',
    primarySoft: 'var(--primary-soft)',
    secondary: 'var(--secondary)',
    warning: 'var(--warning)',
    warningSoft: 'var(--warning-soft)',
    danger: 'var(--danger)',
    dangerSoft: 'var(--danger-soft)',
    border: 'var(--border)',
    muted: 'var(--muted)',
    mutedForeground: 'var(--muted-foreground)',
    subtleForeground: 'var(--subtle-foreground)',
    chart1: 'var(--chart-1)',
    chart2: 'var(--chart-2)',
    chartGrid: 'var(--chart-grid)',
    signalBlue: 'var(--primary)',
    signalBlueSoft: 'var(--primary-soft)',
    signalMint: 'var(--secondary)',
    signalOrange: 'var(--warning)',
    signalOrangeSoft: 'var(--warning-soft)',
    signalRed: 'var(--danger)',
    signalRedSoft: 'var(--danger-soft)',
    slate50: 'var(--background)',
    slate100: 'var(--muted)',
    slate200: 'var(--border)',
    slate400: 'var(--subtle-foreground)',
    slate900: 'var(--foreground)',
    kakaoYellow: '#FEE500',
    kakaoText: '#3C1E1E',
    white: 'var(--card)',
} as const;

export const cssVars = {
    radiusSm: 'var(--radius-sm)',
    radiusMd: 'var(--radius-md)',
    radiusLg: 'var(--radius-lg)',
    fontHeading: 'var(--font-heading)',
    durationNormal: 'var(--duration-normal)',
    easeOutQuart: 'var(--ease-out-quart)',
} as const;

export const effects = {
    headerFrosted: {
        backgroundColor: 'color-mix(in srgb, var(--background) 85%, transparent)',
        backdropFilter: 'blur(12px)',
    },
    stickyFrosted: {
        backgroundColor: 'color-mix(in srgb, var(--background) 92%, transparent)',
        backdropFilter: 'blur(12px)',
    },
    modalBackdrop: {
        backdropFilter: 'blur(4px)',
    },
    softShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
} satisfies Record<string, CSSProperties | string>;

export const chartTokens = {
    axisTick: colors.subtleForeground,
    grid: colors.chartGrid,
    gridMajor: colors.border,
    surface: colors.background,
    primaryStroke: colors.chart1,
    primaryFill: colors.chart1,
    secondaryStroke: colors.chart2,
    secondaryFill: colors.chart2,
} as const;

export const statusTokens = {
    running: {
        gradientStart: colors.primary,
        gradientEnd: colors.primarySoft,
    },
    warning: {
        gradientStart: colors.warning,
        gradientEnd: colors.warningSoft,
    },
    error: {
        gradientStart: colors.danger,
        gradientEnd: colors.dangerSoft,
    },
} as const;

export const brandTokens = {
    kakao: {
        bgClass: 'bg-kakao-yellow',
        textClass: 'text-kakao-brown',
        background: colors.kakaoYellow,
        text: colors.kakaoText,
    },
} as const;

export const classTokens = {
    text: {
        primary: 'text-foreground',
        secondary: 'text-slate-600',
        muted: 'text-muted-foreground',
        subtle: 'text-slate-400',
        disabled: 'text-slate-300',
        inverse: 'text-primary-foreground',
        brand: 'text-primary',
        success: 'text-emerald-600',
        successIcon: 'text-emerald-500',
        warning: 'text-warning',
        warningIcon: 'text-warning',
        danger: 'text-danger',
        dangerIcon: 'text-danger',
        info: 'text-blue-600',
        infoIcon: 'text-blue-500',
    },
    bg: {
        page: 'bg-background',
        surface: 'bg-card',
        subtle: 'bg-background',
        muted: 'bg-muted',
        brand: 'bg-primary',
        brandSoft: 'bg-primary/10',
        successSoft: 'bg-emerald-50',
        successDot: 'bg-emerald-500',
        warningSoft: 'bg-warning/10',
        warningDot: 'bg-warning',
        dangerSoft: 'bg-danger/10',
        dangerDot: 'bg-danger',
        infoSoft: 'bg-blue-50',
        infoDot: 'bg-blue-500',
    },
    border: {
        subtle: 'border-border',
        muted: 'border-border',
        brandSoft: 'border-primary/30',
        successSoft: 'border-emerald-100',
        warningSoft: 'border-warning/20',
        dangerSoft: 'border-danger/20',
        infoSoft: 'border-blue-100',
    },
    hover: {
        subtle: 'hover:bg-slate-50',
        muted: 'hover:bg-slate-100',
        brandBright: 'hover:brightness-110',
        dangerSoft: 'hover:bg-rose-50',
    },
    gradient: {
        loading: 'from-slate-400 to-slate-500',
        danger: 'from-danger to-danger',
        warning: 'from-warning to-warning',
        healthy: 'from-primary to-primary',
        machineIcon: 'from-blue-50 to-indigo-50',
    },
    badge: {
        success: 'bg-secondary/10 text-secondary border-secondary/20',
        warning: 'bg-warning/10 text-warning border-warning/20',
        error: 'bg-danger/10 text-danger border-danger/20',
        info: 'bg-primary/10 text-primary border-primary/20',
        neutral: 'bg-background text-muted-foreground border-border',
    },
    badgeDot: {
        success: 'bg-secondary',
        warning: 'bg-warning',
        error: 'bg-danger',
        info: 'bg-primary',
        neutral: 'bg-slate-400',
    },
    button: {
        primary: 'bg-primary text-primary-foreground hover:brightness-110',
        secondary: 'bg-muted text-foreground hover:bg-slate-200',
        outline: 'border border-border bg-transparent text-foreground hover:bg-background',
        ghost: 'bg-transparent text-muted-foreground hover:bg-background',
        danger: 'bg-danger/10 text-danger hover:bg-danger/15',
    },
    machineType: {
        freezer: 'text-blue-500',
        refrigerator: 'text-cyan-500',
        showcase: 'text-indigo-500',
        storage: 'text-slate-500',
    },
    machinePrediction: {
        danger: 'bg-danger/10 text-danger',
        neutral: 'bg-background text-muted-foreground',
        dangerIconBg: 'bg-danger/10',
        neutralIconBg: 'bg-primary/10',
        dangerIcon: 'text-danger',
        neutralIcon: 'text-primary',
    },
    machineStatus: {
        running: {
            icon: 'text-secondary',
            bg: 'bg-secondary/10',
            border: 'border-secondary/20',
            badge: 'bg-secondary/10 text-secondary',
            dot: 'bg-secondary',
            pin: 'bg-secondary text-secondary-foreground',
        },
        warning: {
            icon: 'text-warning',
            bg: 'bg-warning/10',
            border: 'border-warning/20',
            badge: 'bg-warning/10 text-warning',
            dot: 'bg-warning',
            pin: 'bg-warning text-white',
        },
        error: {
            icon: 'text-danger',
            bg: 'bg-danger/10',
            border: 'border-danger/20',
            badge: 'bg-danger/10 text-danger',
            dot: 'bg-danger',
            pin: 'bg-danger text-white',
        },
    },
    haccpStatus: {
        PASS: {
            summary: 'bg-emerald-50/50 border-emerald-100',
            stripe: 'bg-emerald-400',
            icon: 'bg-emerald-100 text-emerald-600',
            label: 'text-emerald-600/70',
            history: 'bg-emerald-50 text-emerald-600',
        },
        WARNING: {
            summary: 'bg-amber-50/50 border-amber-100',
            stripe: 'bg-amber-400',
            icon: 'bg-amber-100 text-amber-600',
            label: 'text-amber-600/70',
            history: 'bg-amber-50 text-amber-600',
        },
        FAIL: {
            summary: 'bg-rose-50/50 border-rose-100',
            stripe: 'bg-rose-400',
            icon: 'bg-rose-100 text-rose-600',
            label: 'text-rose-600/70',
            history: 'bg-rose-50 text-rose-600',
        },
    },
    eventType: {
        ON: 'bg-primary/10 text-primary',
        DEF: 'bg-warning/10 text-warning',
        OFF: 'bg-danger/10 text-danger',
        default: 'bg-danger/10 text-danger',
    },
    maintenanceAction: {
        CLEANING: {
            icon: 'text-primary bg-primary/10',
            badge: 'bg-primary/10 text-primary',
        },
        CHECK: {
            icon: 'text-warning bg-warning/10',
            badge: 'bg-warning text-white',
        },
        PART_REPLACE: {
            icon: 'text-secondary bg-secondary/10',
            badge: 'bg-secondary text-secondary-foreground',
        },
    },
    notificationType: {
        alert: 'text-danger bg-danger/10',
        report: 'text-primary bg-primary/10',
        maintenance: 'text-secondary bg-secondary/10',
    },
    bottomNav: {
        active: 'text-primary',
        inactive: 'text-slate-400',
        activeBg: 'bg-primary/5',
    },
    profileMenu: {
        account: 'text-slate-400 bg-slate-50',
        subscription: 'text-signal-blue bg-blue-50',
        security: 'text-emerald-500 bg-emerald-50',
        appearance: 'text-slate-400 bg-slate-50',
    },
    healthForecast: {
        dangerCard: 'bg-rose-50 border-rose-100',
        healthyCard: 'bg-emerald-50 border-emerald-100',
        dangerMuted: 'text-rose-400',
        healthyMuted: 'text-emerald-400',
        dangerText: 'text-rose-600',
        healthyText: 'text-emerald-600',
        dangerSmall: 'text-rose-500',
        healthySmall: 'text-emerald-500',
        dangerDot: 'bg-rose-500',
    },
    componentScore: {
        good: 'bg-primary',
        warning: 'bg-warning',
        danger: 'bg-danger',
    },
    statProgress: {
        healthy: 'bg-secondary',
        warning: 'bg-warning',
    },
} as const;
