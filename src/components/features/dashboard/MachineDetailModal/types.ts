import { type Machine } from '../MachineCard';

export interface MachineDetailModalProps {
    machine: Machine | null;
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'analysis' | 'maintenance';
}

export type TabType = 'analysis' | 'maintenance' | 'smartlog';
export type MaintenanceView = 'history' | 'request' | 'success';
