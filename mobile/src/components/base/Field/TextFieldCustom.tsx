import React, {useMemo} from 'react';

import {StyleProp, StyleSheet} from 'react-native';

import {sizeScale} from '@utils/dimensions';

import {COLORS} from '@assets/color';

import TextInput from '../TextInput/TextInput';
import FieldContainerCustom from './FieldContainerCustom';

interface ITextFieldCustomProps {
  value: string;
  onChange: (text: string) => void;
  style?: StyleProp<any>;
}

const TextFieldCustom = ({value, onChange, style}: ITextFieldCustomProps) => {
  const textInputStyle = useMemo(() => [styles.textInput, style], [style]);
  return (
    <FieldContainerCustom>
      <TextInput
        style={textInputStyle}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        autoFocus
      />
    </FieldContainerCustom>
  );
};

export default TextFieldCustom;

const styles = StyleSheet.create({
  textInput: {
    fontSize: sizeScale(24),
    color: COLORS.ELEMENT_BASE,
    textAlign: 'center',
    lineHeight: sizeScale(0),
  },
});
