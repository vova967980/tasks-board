type ErrorStringKeys = 'required';

type ErrorStrings = {
  [K in ErrorStringKeys]: string;
};
type ErrorFunctions = {
  requiredFunc: (fieldName: string) => string;
  maxLengthFunc: (fieldName: string, maxLength: number) => string;
};

type ErrorDict = ErrorStrings & ErrorFunctions;

export const errorsDict: ErrorDict = {
  required: 'This field is required.',
  requiredFunc: fieldName => `${fieldName} is required.`,
  maxLengthFunc: (fieldName, maxLength) =>
    `${fieldName} should not exceed ${maxLength} characters.`,
};
