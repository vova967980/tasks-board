import { Field, Input } from '@ui-kit';
import { useId, type ComponentProps, type FC } from 'react';

type InputFieldProps = ComponentProps<typeof Field> & Omit<ComponentProps<typeof Input>, 'id'>;

export const InputField: FC<InputFieldProps> = ({ fieldId, label, error, ...inputProps }) => {
  const id = useId();

  return (
    <Field fieldId={fieldId ?? id} label={label} error={error}>
      <Input id={fieldId ?? id} error={error} {...inputProps} />
    </Field>
  );
};
