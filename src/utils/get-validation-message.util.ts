import { ValidationError } from 'class-validator';

export const validationMessageFormatter = (errors: ValidationError[], initialMessages?: object, parentField?: string): string => {
  const messages = initialMessages || {};

  let errorField = '';

  errors.forEach(error => {
    errorField = parentField ? `${parentField}.${error.property}` : error.property;

    const isChildrenError = !error.constraints && error.children.length;
    if (isChildrenError) {
      validationMessageFormatter(error.children, messages, errorField);
    } else {
      const validationList = Object.values(error.constraints);

      messages[errorField] = validationList.join(', ') || 'Invalid value';
    }
  });

  return Object.entries(messages).reduce((prevVal, [key, val]) => {
    return `${prevVal ? prevVal + ', ' : ''}${key}: ${val}`;
  }, '');
};
