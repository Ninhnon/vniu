import {Controller, useFormContext} from 'react-hook-form';

import React from 'react';

import {TextInputProps} from 'react-native';
import { Field } from '../Field';


type TFormFieldPasswordSpecialProps<T> = {
  name: T;
  placeholder?: string;
  helpMessage?: string;
} & TextInputProps;
const FormFieldPasswordSpecial = <T extends string>({
  name,
  placeholder = 'Type here',
  helpMessage,
  ...props
}: TFormFieldPasswordSpecialProps<T>) => {
  const {control, trigger} = useFormContext();
  const onBlurHandle = (a: () => void) => {
    return () => {
      trigger();
      a();
    };
  };
  return (
    <>
      <Controller
        name={name || ''}
        control={control}
        render={({field: {onChange, onBlur, value}, fieldState}) => (
          <Field.Special
            placeholder={placeholder}
            errorMessage={fieldState.error?.message || ''}
            helpMessage={fieldState.error?.message ? '' : helpMessage}
            onChangeText={onChange}
            value={value}
            onBlur={onBlurHandle(onBlur)}
            {...props}
          />
        )}
      />
    </>
  );
};
export default FormFieldPasswordSpecial;
