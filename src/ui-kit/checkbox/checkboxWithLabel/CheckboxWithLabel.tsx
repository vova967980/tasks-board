import { type ComponentProps, type FC, type ReactNode } from 'react';
import styles from './CheckboxWithLabel.module.scss';
import { Checkbox } from '../';
import clsx from 'clsx';

interface CheckboxWithLabelProps extends ComponentProps<typeof Checkbox> {
  children: ReactNode;
  className?: string;
}

export const CheckboxWithLabel: FC<CheckboxWithLabelProps> = ({
  children,
  className,
  ...checkboxProps
}) => {
  const { disabled } = checkboxProps;

  return (
    <label className={clsx(styles.wrapper, className, disabled && styles.disabled)}>
      <Checkbox {...checkboxProps} />
      <span className={styles.label}>{children}</span>
    </label>
  );
};
