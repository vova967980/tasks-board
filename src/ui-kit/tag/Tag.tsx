import type { FC, ReactNode } from 'react';
import styles from './Tag.module.scss';
import clsx from 'clsx';

interface TagProps {
  children?: ReactNode;
  className?: string;
  type: 'radio' | 'checkbox';
  checked: boolean;
  name: string;
  onChange: (value: string) => void;
}

export const Tag: FC<TagProps> = ({ children, className, type, onChange, checked, name }) => {
  return (
    <label className={clsx(styles.tagWrapper, checked && styles.checked, className)}>
      <div>{children}</div>
      <input
        name={name}
        type={type}
        checked={checked}
        onChange={e => onChange(e.target.value)}
        className={styles.input}
        unselectable="on"
      />
    </label>
  );
};
