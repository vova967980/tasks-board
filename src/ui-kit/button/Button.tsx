import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

type Variant = 'ghost' | 'iconDanger' | 'icon' | 'filled';
type Size = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = 'ghost', size = 'md', ...restProps }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          styles.buttonContainer,
          styles[`variant_${variant}`],
          styles[`size_${size}`],
          className,
        )}
        {...restProps}
      >
        {children}
      </button>
    );
  },
);
