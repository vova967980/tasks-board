import clsx from 'clsx';
import { forwardRef, type TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...restProps }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(styles.textarea, error && styles.error, className)}
        {...restProps}
      />
    );
  },
);
