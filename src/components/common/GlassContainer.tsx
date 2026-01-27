import { cn } from '../../lib/utils';
import type { ReactNode, HTMLAttributes } from 'react';

interface GlassContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function GlassContainer({ children, className, ...props }: GlassContainerProps) {
    return (
        <div className={cn('glass rounded-3xl p-6', className)} {...props}>
            {children}
        </div>
    );
}
