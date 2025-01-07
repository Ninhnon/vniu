import React, {useMemo} from 'react';

import {StyleSheet, View} from 'react-native';

import {sizeScale} from '@utils/dimensions';

import {COLORS} from '@assets/color';

import Text from '../Text/Text';

interface IFieldContainerProps {
  children?: React.ReactNode;
  label?: string;
  errorMessage?: string;
  isFocus?: boolean;
  isMultiline?: boolean;
}
const FieldContainer = ({
  children,
  label,
  errorMessage,
  isFocus,
  isMultiline = false,
}: IFieldContainerProps) => {
  const childrenWrapperStyle = useMemo(() => {
    const childrenWrapper = isMultiline
      ? StyleSheet.compose(styles.childrenWrapper, {
          height: sizeScale(182),
          paddingVertical: sizeScale(12),
          alignItems: 'flex-start',
        })
      : styles.childrenWrapper;

    if (errorMessage) {
      return StyleSheet.compose(childrenWrapper, styles.childrenWrapperError);
    }
    if (isFocus) {
      return StyleSheet.compose(childrenWrapper, styles.childrenWrapperFocus);
    }
    return childrenWrapper;
  }, [errorMessage, isMultiline, isFocus]);

  return (
    <View style={styles.container}>
      {label && (
        <Text size="16" weight="semiBold" color="ELEMENT_BASE">
          {label}
        </Text>
      )}
      <View style={childrenWrapperStyle}>{children}</View>

      {errorMessage && (
        <Text size="12" weight="light" color="SEMANTIC_DANGER_1">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};
export default FieldContainer;
const styles = StyleSheet.create({
  container: {gap: sizeScale(8)},
  childrenWrapper: {
    borderRadius: sizeScale(12),
    borderWidth: sizeScale(1),
    flexDirection: 'row',
    borderColor: COLORS.BORDER_NEUTRAL,
    gap: sizeScale(8),
    paddingHorizontal: sizeScale(12),
    height: sizeScale(44),
    alignItems: 'center',
  },
  childrenWrapperError: {
    borderColor: COLORS.SEMANTIC_DANGER_1,
    borderWidth: sizeScale(2),
  },
  childrenWrapperFocus: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.SURFACE_ACCENT_5,
  },
});
