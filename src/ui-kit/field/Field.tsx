import { type FC, type ReactNode } from 'react';
import { FormHelperText } from '@ui-kit';
import styles from './Field.module.scss';

interface FieldProps {
  fieldId?: string;
  label?: ReactNode;
  error?: string;
  children?: ReactNode;
}

export const Field: FC<FieldProps> = ({ label, error, children, fieldId }) => {
  return (
    <div className={styles.fieldWrapper}>
      {label && <label htmlFor={fieldId}>{label}</label>}
      {children}
      {error && <FormHelperText type="error">{error}</FormHelperText>}
    </div>
  );
};
