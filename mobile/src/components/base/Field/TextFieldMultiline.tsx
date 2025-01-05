import React, {useCallback, useState} from 'react';

import {TextInputProps} from 'react-native';

import TextInput from '../TextInput/TextInput';
import FieldContainer from './FieldContainer';

type TTextFieldProps = {
  label?: string;
  errorMessage?: string;
  value: string;
  onClearText?: () => void;
} & TextInputProps;

const TextFieldMultiline = ({
  label,
  errorMessage,
  onClearText,
  ...props
}: TTextFieldProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const _handleOnfocus = useCallback(() => {
    setIsFocus(true);
  }, []);
  const _handleOnEditing = useCallback(() => {
    setIsFocus(false);
  }, []);

  return (
    <FieldContainer
      label={label}
      errorMessage={errorMessage}
      isFocus={isFocus}
      isMultiline={true}>
      <TextInput
        onEndEditing={_handleOnEditing}
        onFocus={_handleOnfocus}
        onClearText={onClearText}
        multiline
        {...props}
      />
    </FieldContainer>
  );
};

export default TextFieldMultiline;
