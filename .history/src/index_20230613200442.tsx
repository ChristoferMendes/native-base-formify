import {
  FormControl,
  IFormControlErrorMessageProps,
  IFormControlLabelProps,
  ITextAreaProps,
  Input as NativeBaseInput,
  TextArea as NativeBaseTextArea,
} from 'native-base';
import { IInputProps } from 'native-base/lib/typescript/components/primitives/Input/types';
import { ColorType } from 'native-base/lib/typescript/components/types';
import { Children, cloneElement } from 'react';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';

function Main<T>({
  children,
  control,
  errors,
}: {
  children: JSX.Element[] | JSX.Element;
  control: Control<T extends FieldValues ? T : FieldValues, any>;
  errors: FieldErrors<T extends FieldValues ? T : FieldValues>;
}) {
  const arrayChildren = Children.toArray(children);
  const isInvalid = Boolean(Object.keys(errors).length);

  return (
    <FormControl isInvalid={isInvalid}>
      {Children.map(arrayChildren, (child) => {
        const isReactElement = child && typeof child === 'object' && 'type' in child && 'props' in child;

        if (!isReactElement) return null;

        return (
          <Controller
            control={control}
            name={child.props.name}
            render={({ field: { onChange, value } }) => {
              return cloneElement(child, { onChange, value, errors });
            }}
          />
        );
      })}
    </FormControl>
  );
}

interface InputProps extends IInputProps {
  _erroMessageProps?: IFormControlErrorMessageProps;
  _labelProps?: IFormControlLabelProps;
  label?: string;
  labelColor?: ColorType;
  name: string;
  onChange?: (...event: any[]) => void;
  errors?: any;
}

const Input = (props: InputProps) => {
  return (
    <>
      <FormControl.Label _text={{ color: props.labelColor }}>{props.label ?? props.name}</FormControl.Label>
      <FormControl.ErrorMessage {...props._erroMessageProps}>
        {props.errors[props.name]?.message}
      </FormControl.ErrorMessage>
      <NativeBaseInput onChangeText={props.onChange} value={props.value} {...props} />
    </>
  );
};

interface TextAreaProps extends ITextAreaProps {
  _labelProps?: IFormControlLabelProps;
  _erroMessageProps?: IFormControlErrorMessageProps;
  name: string;
  labelText: string;
  onChange?: (...event: any[]) => void;
  errors?: any;
}

const TextArea = (props: TextAreaProps) => {
  return (
    <>
      <FormControl.Label {...props._labelProps}>{props.labelText ?? props.name}</FormControl.Label>
      <FormControl.ErrorMessage {...props._erroMessageProps}>
        {props.errors[props.name]?.message}
      </FormControl.ErrorMessage>
      <NativeBaseTextArea autoCompleteType={undefined} onChangeText={props.onChange} value={props.value} {...props} />
    </>
  );
};

const Form = Object.assign(Main, { Input, TextArea });

export default Form;
