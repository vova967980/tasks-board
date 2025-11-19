import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', className, error, ...restProps }, ref) => {
    return (
      <input
        ref={ref}
        {...restProps}
        type={type}
        className={clsx(styles.input, !!error && styles.error, className)}
      />
    );
  },
);
