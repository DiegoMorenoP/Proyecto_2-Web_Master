import { cn } from '../../lib/utils';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'outline';
    children: React.ReactNode;
    className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
                {
                    'bg-primary/10 text-primary': variant === 'default',
                    'bg-accent/10 text-accent': variant === 'success',
                    'bg-orange-500/10 text-orange-500': variant === 'warning',
                    'border border-white/20 text-slate-300': variant === 'outline',
                },
                className
            )}
        >
            {children}
        </span>
    );
}
