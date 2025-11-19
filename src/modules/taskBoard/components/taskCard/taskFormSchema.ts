import * as yup from 'yup';
import { errorsDict } from '@shared-utils';

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 200;

export const taskFormSchema = yup.object({
  title: yup
    .string()
    .required(errorsDict.requiredFunc('Title'))
    .max(TITLE_MAX_LENGTH, errorsDict.maxLengthFunc('Title', TITLE_MAX_LENGTH)),
  description: yup
    .string()
    .defined()
    .default('')
    .max(DESCRIPTION_MAX_LENGTH, errorsDict.maxLengthFunc('Description', DESCRIPTION_MAX_LENGTH)),
});
