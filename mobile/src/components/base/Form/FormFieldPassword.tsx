import {Controller, useFormContext} from 'react-hook-form';

import React from 'react';
import { Field } from '../Field';


interface IFormFieldPasswordProps<T> {
  name: T;
  placeholder: string;
}
const FormFieldPassword = <T extends string>({
  name,
  placeholder = 'Type here',
}: IFormFieldPasswordProps<T>) => {
  const {
    formState: {errors},
    control,
  } = useFormContext();

  return (
    <>
      <Controller
        name={name || ''}
        control={control}
        render={({field: {onChange, value}}) => (
          <Field.Password
            placeholder={placeholder}
            errorMessage={errors?.[name]?.message?.toString() || ''}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
    </>
  );
};
export default FormFieldPassword;
