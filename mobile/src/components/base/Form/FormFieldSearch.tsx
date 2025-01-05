import {Controller, useFormContext} from 'react-hook-form';

import React from 'react';
import { Field } from '../Field';


interface IFormFieldSearchProps<T> {
  name: T;
  placeholder?: string;
}
const FormFieldSearch = <T extends string>({
  name,
  placeholder = 'Search',
}: IFormFieldSearchProps<T>) => {
  const {control} = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({field: {onChange}}) => (
          <Field.Search
            placeholder={placeholder}
            onChangeText={onChange}
            // value={value}
            onClearText={() => onChange('')}
          />
        )}
      />
    </>
  );
};
export default FormFieldSearch;
