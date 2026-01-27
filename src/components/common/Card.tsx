import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: 'default' | 'glass' | 'interactive';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    'rounded-3xl border border-white/5 bg-slate-900/50 p-6',
                    {
                        'glass': variant === 'glass',
                        'glass glass-hover cursor-pointer': variant === 'interactive',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';

export { Card };
