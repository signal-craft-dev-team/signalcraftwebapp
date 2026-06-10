import { ReactNode } from 'react';

interface SettingsGroupProps {
    title?: string;
    children: ReactNode;
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
    return (
        <div className="mb-6">
            {title && (
                <h4 className="section-label px-4 ml-1">
                    {title}
                </h4>
            )}
            <div className="bg-white shadow-card overflow-hidden border border-slate-100"
                style={{ borderRadius: 'var(--radius-md)' }}
            >
                {children}
            </div>
        </div>
    );
}
