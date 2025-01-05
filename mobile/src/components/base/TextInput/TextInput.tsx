import React, {useCallback, useMemo} from 'react';

import {
  Pressable,
  TextInput as RNTextInput,
  StyleProp,
  StyleSheet,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';

import {sizeScale} from '@utils/dimensions';

import {COLORS} from '@assets/color';

import Show from '../Show/Show';
import SvgIcon from '../SvgIcon/SvgIcon';

type TTextInputProps = {
  style?: StyleProp<TextStyle>;
  onClearText?: () => void;
} & TextInputProps;
const TextInput = ({style, onClearText, ...props}: TTextInputProps) => {
  const _handleClearText = useCallback(() => {
    onClearText?.();
  }, [onClearText]);
  const textInputStyle = useMemo(() => {
    return StyleSheet.compose(styles.textInput, style);
  }, [style]);

  const isShowClearTextButtonCondition = useMemo(() => {
    return onClearText && !!props.value?.trim();
  }, [onClearText, props.value]);

  return (
    <View style={styles.textInputContainer}>
      <RNTextInput
        style={textInputStyle}
        cursorColor={COLORS.ELEMENT_BASE}
        placeholderTextColor={COLORS.ELEMENT_BASE_3}
        autoCorrect={false}
        {...props}
      />
      <Show.When isTrue={isShowClearTextButtonCondition}>
        <Pressable onPress={_handleClearText}>
          <SvgIcon name="xCircle" size={20} fill="ELEMENT_BASE_3" />
        </Pressable>
      </Show.When>
    </View>
  );
};
export default TextInput;
const styles = StyleSheet.create({
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizeScale(8),
  },
  textInput: {
    fontSize: sizeScale(14),
    lineHeight: sizeScale(20),
    color: COLORS.ELEMENT_BASE,
    flex: 1,
  },
});
