import React, {useCallback, useState} from 'react';

import {TextInputProps} from 'react-native';

import Text from '@components/base/Text/Text';

import TextInput from '../TextInput/TextInput';
import FieldContainer from './FieldContainer';

type TTextFieldProps = {
  label?: string;
  errorMessage?: string;
  value?: string;
  iconRight?: React.ReactNode;
  unit?: string;
  onClearText?: () => void;
} & TextInputProps;
const TextField = ({
  label,
  errorMessage,
  iconRight,
  unit,
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
    <FieldContainer label={label} errorMessage={errorMessage} isFocus={isFocus}>
      <TextInput
        onEndEditing={_handleOnEditing}
        onFocus={_handleOnfocus}
        onClearText={onClearText}
        {...props}
      />
      {unit && (
        <Text size="14" weight="light" color="ELEMENT_BASE">
          {unit}
        </Text>
      )}
      {iconRight}
    </FieldContainer>
  );
};
export default TextField;
