import {Controller, useFormContext} from 'react-hook-form';

import React from 'react';

import {Field} from '../../base';

interface IFormFieldProps<T> {
  name: T;
  placeholder?: string;
}
const FormField = <T extends string>({
  name,
  placeholder = 'Type here',
}: IFormFieldProps<T>) => {
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
          <Field.Input
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
export default FormField;
