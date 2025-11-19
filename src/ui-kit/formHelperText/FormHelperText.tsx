import type { FC, ReactNode } from 'react';
import styles from './FormHelperText.module.scss';
import clsx from 'clsx';

interface FormHelperTextProps {
  type: 'info' | 'error' | 'warning';
  children?: ReactNode;
}

export const FormHelperText: FC<FormHelperTextProps> = ({ type, children }) => {
  return <span className={clsx(styles.formHelperText, styles[`type_${type}`])}>{children}</span>;
};
