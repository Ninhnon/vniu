import {Controller, useFormContext} from 'react-hook-form';

import React from 'react';

import {StyleSheet, View} from 'react-native';

import {sizeScale} from '@utils/dimensions';
import { Field } from '../Field';
import Text from '../Text/Text';


interface IFormFieldProps<T> {
  name: T;
  placeholder?: string;
}
const FormMultilineField = <T extends string>({
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
          <View style={styles.root}>
            <Field.Multiline
              placeholder={placeholder}
              errorMessage={errors?.[name]?.message?.toString() || ''}
              onChangeText={onChange}
              value={value}
            />
            <View>
              <Text size="12" weight="light" color="ELEMENT_BASE_2">
                {`${value.length} / 500 characters`}
              </Text>
            </View>
          </View>
        )}
      />
    </>
  );
};
const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    gap: sizeScale(8),
  },
});
export default FormMultilineField;
