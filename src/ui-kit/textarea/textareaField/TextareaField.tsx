import { Field, Textarea } from '@ui-kit';
import { useId, type ComponentProps, type FC } from 'react';

type InputFieldProps = ComponentProps<typeof Field> & Omit<ComponentProps<typeof Textarea>, 'id'>;

export const TextareaField: FC<InputFieldProps> = ({ fieldId, label, error, ...textareaProps }) => {
  const id = useId();

  return (
    <Field fieldId={fieldId ?? id} label={label} error={error}>
      <Textarea id={fieldId ?? id} error={error} {...textareaProps} />
    </Field>
  );
};
