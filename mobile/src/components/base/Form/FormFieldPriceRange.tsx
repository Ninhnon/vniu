import {Controller, useFormContext} from 'react-hook-form';

import React from 'react';

import TextField from '../Field/TextField';
import LayoutWrapper from '../Layout/LayoutWrapper';

interface IFormFieldRangeProps<T> {
  minName: T;
  maxName: T;
  minValue?: number;
  maxValue?: number;
  unit?: string;
  placeholder?: string;
}

const FormFieldRange = <T extends string>({
  minName,
  maxName,
  unit,
}: IFormFieldRangeProps<T>) => {
  const {control} = useFormContext();

  return (
    <LayoutWrapper gap={4} flexDirection="row">
      <LayoutWrapper flex={1}>
        <Controller
          name={minName || 'minName'}
          control={control}
          render={({field: {onChange, value}, fieldState: {error}}) => {
            return (
              <>
                <TextField
                  keyboardType="numeric"
                  errorMessage={error?.message}
                  placeholder={'From'}
                  onChangeText={text => {
                    onChange(text);
                  }}
                  unit={unit}
                  value={value}
                />
              </>
            );
          }}
        />
      </LayoutWrapper>
      <LayoutWrapper flex={1}>
        <Controller
          name={maxName || 'maxName'}
          control={control}
          render={({field: {onChange, value}}) => (
            <>
              <TextField
                keyboardType="numeric"
                placeholder={'To'}
                onChangeText={text => {
                  onChange(text);
                }}
                unit={unit}
                value={value}
              />
            </>
          )}
        />
      </LayoutWrapper>
    </LayoutWrapper>
  );
};

export default FormFieldRange;
