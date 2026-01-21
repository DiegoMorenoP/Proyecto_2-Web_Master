import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
    return (
        <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]', className)}>
            {children}
        </div>
    );
}

interface BentoItemProps {
    children: ReactNode;
    className?: string;
    colSpan?: 1 | 2 | 3;
    rowSpan?: 1 | 2;
}

export function BentoItem({ children, className, colSpan = 1, rowSpan = 1 }: BentoItemProps) {
    return (
        <div
            className={cn(
                'glass rounded-3xl p-6 transition-all hover:scale-[1.01]',
                {
                    'md:col-span-1': colSpan === 1,
                    'md:col-span-2': colSpan === 2,
                    'md:col-span-3': colSpan === 3,
                    'md:row-span-1': rowSpan === 1,
                    'md:row-span-2': rowSpan === 2,
                },
                className
            )}
        >
            {children}
        </div>
    );
}
