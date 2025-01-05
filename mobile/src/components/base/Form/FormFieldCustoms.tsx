import {Controller, useFormContext} from 'react-hook-form';

import React from 'react';

import {StyleProp, TextStyle} from 'react-native';

import {Field} from '../Field';

interface IFormFieldCustomsProps {
  style?: StyleProp<TextStyle>;
}

const FormFieldCustoms = ({style}: IFormFieldCustomsProps) => {
  const {control} = useFormContext();
  return (
    <>
      <Controller
        name="price"
        control={control}
        render={({field: {value, onChange}}) => (
          <Field.Customs style={style} value={value} onChange={onChange} />
        )}
      />
    </>
  );
};

export default FormFieldCustoms;
