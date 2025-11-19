import { useController, useFormContext } from 'react-hook-form';
import { InputField, TextareaField } from '@ui-kit';
import { Fragment } from 'react';
import type { TaskFormData } from '../../../types';
import { TITLE_MAX_LENGTH, DESCRIPTION_MAX_LENGTH } from '../taskFormSchema.ts';

export const TaskForm = () => {
  const { control } = useFormContext<TaskFormData>();

  const { field: titleField, fieldState: titleFieldState } = useController({
    control,
    name: 'title',
  });
  const { field: descriptionField, fieldState: descriptionFieldState } = useController({
    control,
    name: 'description',
  });

  return (
    <Fragment>
      <InputField
        {...titleField}
        error={titleFieldState.error?.message}
        placeholder="Title..."
        maxLength={TITLE_MAX_LENGTH}
      />
      <TextareaField
        {...descriptionField}
        error={descriptionFieldState.error?.message}
        placeholder="Description..."
        rows={3}
        maxLength={DESCRIPTION_MAX_LENGTH}
      />
    </Fragment>
  );
};
