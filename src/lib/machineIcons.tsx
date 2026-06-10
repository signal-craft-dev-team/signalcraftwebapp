import type { ReactNode } from 'react';
import {
    Snowflake, Thermometer, Wind, Box,
    FlaskConical, Flame, Gauge, Fan,
} from 'lucide-react';
import { classTokens } from '@/styles/tokens';
import { cn } from '@/lib/utils';

export function getMachineIcon(type: string, className?: string): ReactNode {
    const t = type?.toUpperCase() || '';
    const base = className ?? 'size-9 sm:size-10';

    if (t.includes('REACTOR')) return <FlaskConical className={cn(base, classTokens.machineType.refrigerator)} />;
    if (t.includes('FURNACE') || t.includes('HEAT') || t.includes('OVEN')) return <Flame className={cn(base, classTokens.machineType.freezer)} />;
    if (t.includes('COATER') || t.includes('CHAMBER') || t.includes('FILTER')) return <Gauge className={cn(base, classTokens.machineType.storage)} />;
    if (t.includes('CHILLER')) return <Snowflake className={cn(base, classTokens.machineType.refrigerator)} />;
    if (t.includes('FREEZER') || t.includes('BLAST')) return <Snowflake className={cn(base, classTokens.machineType.freezer)} />;
    if (t.includes('REFRIGERATOR')) return <Thermometer className={cn(base, classTokens.machineType.refrigerator)} />;
    if (t.includes('COMPRESSOR')) return <Gauge className={cn(base, classTokens.machineType.storage)} />;
    if (t.includes('VACUUM')) return <Wind className={cn(base, classTokens.machineType.storage)} />;
    if (t.includes('AHU') || t.includes('AIR_HANDLING')) return <Fan className={cn(base, classTokens.machineType.showcase)} />;
    if (t.includes('SHOWCASE')) return <Wind className={cn(base, classTokens.machineType.showcase)} />;
    if (t.includes('COLD') || t.includes('STORAGE')) return <Box className={cn(base, classTokens.machineType.storage)} />;

    return <Snowflake className={cn(base, classTokens.machineType.freezer)} />;
}
