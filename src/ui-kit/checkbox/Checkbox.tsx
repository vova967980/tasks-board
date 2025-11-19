import { type FC, useEffect, useRef } from 'react';
import styles from './Checkbox.module.scss';
import clsx from 'clsx';
import { CheckboxBlankIcon, CheckboxCheckedIcon, CheckboxIndeterminateIcon } from '@assets';

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: FC<CheckboxProps> = ({
  checked,
  indeterminate = false,
  onChange,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const renderIcon = () => {
    if (indeterminate) return <CheckboxIndeterminateIcon />;
    if (checked) return <CheckboxCheckedIcon />;
    return <CheckboxBlankIcon />;
  };

  return (
    <label className={styles.wrapper}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className={styles.input}
        disabled={disabled}
      />
      <span
        className={clsx(
          styles.icon,
          checked && styles.checked,
          indeterminate && styles.indeterminate,
        )}
      >
        {renderIcon()}
      </span>
    </label>
  );
};
