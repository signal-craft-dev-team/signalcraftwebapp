import type { ReactNode } from 'react';
import { Gauge } from 'lucide-react';
import { classTokens } from '@/styles/tokens';
import { cn } from '@/lib/utils';

export function getMachineIcon(_type: string, className?: string): ReactNode {
    const base = className ?? 'size-9 sm:size-10';
    return <Gauge className={cn(base, classTokens.machineType.storage)} />;
}
