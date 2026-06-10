import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { classTokens } from '@/styles/tokens';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading,
    disabled,
    ...props
}: ButtonProps) {
    const sizes = {
        sm: 'px-3 py-1.5 text-sm min-h-[36px]',
        md: 'px-5 py-2.5 min-h-[44px]',
        lg: 'px-8 py-3.5 text-lg min-h-[52px]',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
            className={cn(
                "toss-button",
                classTokens.button[variant],
                sizes[size],
                loading && "opacity-70 pointer-events-none",
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {children}
        </motion.button>
    );
}
