import type {
  FieldPathByValue,
  FieldValues,
} from 'react-hook-form';
import type { SelectFieldProps, SelectOption, TextInputProps } from '@cms/ui';

export interface FormTextInputProps<Values extends FieldValues>
  extends Omit<TextInputProps, 'defaultValue' | 'error' | 'name' | 'value'> {
  name: FieldPathByValue<Values, string>;
}

export interface FormSelectFieldProps<Values extends FieldValues>
  extends Omit<
    SelectFieldProps,
    'defaultValue' | 'error' | 'name' | 'onValueChange' | 'options' | 'value'
  > {
  name: FieldPathByValue<Values, string>;
  options: readonly SelectOption[];
}
