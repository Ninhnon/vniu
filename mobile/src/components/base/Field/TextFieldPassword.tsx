import React, {useCallback, useState} from 'react';

import {Pressable, TextInputProps} from 'react-native';

import SvgIcon from '../SvgIcon/SvgIcon';
import TextInput from '../TextInput/TextInput';
import FieldContainer from './FieldContainer';

type TTextFieldPasswordProps = {
  label?: string;
  errorMessage?: string;
  onClearText?: () => void;
} & TextInputProps;
const TextFieldPassword = ({
  label,
  errorMessage,
  onClearText,
  ...props
}: TTextFieldPasswordProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const handleOnFocus = useCallback(() => {
    setIsFocus(true);
  }, []);

  const handleOnEditing = useCallback(() => {
    setIsFocus(false);
  }, []);

  const handleToggleShowPassword = useCallback(() => {
    setIsShowPassword(prevState => !prevState);
  }, []);

  return (
    <FieldContainer label={label} errorMessage={errorMessage} isFocus={isFocus}>
      <TextInput
        onEndEditing={handleOnEditing}
        onFocus={handleOnFocus}
        onClearText={onClearText}
        secureTextEntry={!isShowPassword}
        {...props}
      />
      <Pressable onPress={handleToggleShowPassword}>
        <SvgIcon
          name={isShowPassword ? 'eye' : 'eyeSlash'}
          size={20}
          fill="ELEMENT_ACCENT"
        />
      </Pressable>
    </FieldContainer>
  );
};
export default TextFieldPassword;
