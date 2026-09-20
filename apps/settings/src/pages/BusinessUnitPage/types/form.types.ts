import type {
  FieldPathByValue,
  FieldValues,
} from 'react-hook-form';
import type {
  MultiSelectFieldProps,
  SelectFieldProps,
  SelectOption,
} from '@cms/ui';

export interface FormSelectFieldProps<Values extends FieldValues>
  extends Omit<
    SelectFieldProps,
    'defaultValue' | 'error' | 'name' | 'onValueChange' | 'options' | 'value'
  > {
  name: FieldPathByValue<Values, string>;
  onValueChange?: (value: string) => void;
  options: readonly SelectOption[];
}

export interface FormMultiSelectFieldProps<Values extends FieldValues>
  extends Omit<
    MultiSelectFieldProps,
    'defaultValue' | 'error' | 'name' | 'onValueChange' | 'options' | 'value'
  > {
  name: FieldPathByValue<Values, string[]>;
  options: readonly SelectOption[];
}
