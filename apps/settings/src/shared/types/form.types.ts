import type {
  FieldPathByValue,
  FieldValues,
} from 'react-hook-form';
import type { TextareaProps, TextInputProps } from '@cms/ui';

export interface FormTextInputProps<Values extends FieldValues>
  extends Omit<TextInputProps, 'defaultValue' | 'error' | 'name' | 'value'> {
  name: FieldPathByValue<Values, string>;
}

export interface FormTextareaProps<Values extends FieldValues>
  extends Omit<TextareaProps, 'defaultValue' | 'error' | 'name' | 'value'> {
  name: FieldPathByValue<Values, string>;
}
