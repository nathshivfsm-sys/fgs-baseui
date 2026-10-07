import type { FieldPathByValue, FieldValues } from 'react-hook-form';
import type {
  DatePickerFieldProps,
  EmailInputFieldProps,
  PhoneInputProps,
  TextareaProps,
  TextInputProps,
  TimePickerFieldProps,
} from '@cms/ui';

export interface FormTextInputProps<Values extends FieldValues>
  extends Omit<TextInputProps, 'defaultValue' | 'error' | 'name' | 'value'> {
  name: FieldPathByValue<Values, string>;
}

export interface FormTextareaProps<Values extends FieldValues>
  extends Omit<TextareaProps, 'defaultValue' | 'error' | 'name' | 'value'> {
  name: FieldPathByValue<Values, string>;
}

export interface FormDatePickerProps<Values extends FieldValues>
  extends Omit<
    DatePickerFieldProps,
    'defaultValue' | 'error' | 'name' | 'onValueChange' | 'value'
  > {
  name: FieldPathByValue<Values, string>;
}

export interface FormEmailInputProps<Values extends FieldValues>
  extends Omit<
    EmailInputFieldProps,
    'defaultValue' | 'error' | 'name' | 'value'
  > {
  name: FieldPathByValue<Values, string>;
}

export interface FormTimePickerProps<Values extends FieldValues>
  extends Omit<
    TimePickerFieldProps,
    'defaultValue' | 'error' | 'name' | 'onValueChange' | 'value'
  > {
  name: FieldPathByValue<Values, string>;
}

export interface FormPhoneInputProps<Values extends FieldValues>
  extends Omit<
    PhoneInputProps,
    'defaultValue' | 'error' | 'name' | 'onValueChange' | 'value'
  > {
  name: FieldPathByValue<Values, string>;
}
