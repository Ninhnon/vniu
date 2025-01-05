import {Controller, useFormContext} from 'react-hook-form';

import React from 'react';

import {TextInputProps} from 'react-native';
import { Field } from '../Field';


type TFormFieldSpecialProps<T> = {
  name: T;
  placeholder?: string;
} & TextInputProps;
const FormFieldSpecial = <T extends string>({
  name,
  placeholder = 'Type here',

  ...props
}: TFormFieldSpecialProps<T>) => {
  const {control} = useFormContext();

  return (
    <>
      <Controller
        name={name || ''}
        control={control}
        render={({field: {onChange, onBlur, value}, fieldState}) => (
          <Field.Special
            placeholder={placeholder}
            errorMessage={fieldState.error?.message || ''}
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            {...props}
          />
        )}
      />
    </>
  );
};
export default FormFieldSpecial;
