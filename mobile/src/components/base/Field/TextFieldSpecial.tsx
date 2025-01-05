import React from 'react';

import {StyleSheet, TextInputProps} from 'react-native';

import {sizeScale} from '@utils/dimensions';

import {COLORS} from '@assets/color';

import TextInput from '../TextInput/TextInput';
import SpecialFieldContainer from './SpecialFieldContainer';

type TTextFieldSpecialProps = {
  errorMessage?: string;
  helpMessage?: string;
} & TextInputProps;

const TextFieldSpecial = ({
  errorMessage,
  helpMessage,
  ...props
}: TTextFieldSpecialProps) => {
  return (
    <SpecialFieldContainer
      errorMessage={errorMessage}
      helpMessage={helpMessage}>
      <TextInput style={styles.textInput} {...props} />
    </SpecialFieldContainer>
  );
};
export default TextFieldSpecial;
const styles = StyleSheet.create({
  textInput: {
    fontSize: sizeScale(24),
    lineHeight: sizeScale(32),
    color: COLORS.ELEMENT_BASE,
  },
});
