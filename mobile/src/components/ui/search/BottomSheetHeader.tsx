import React from 'react';

import {Pressable, StyleSheet, View} from 'react-native';

import {Text} from '@components/base';

import {sizeScale} from '@utils/dimensions';

import {COLORS} from '@assets/color';

type TBottomSheetHeaderProps = {
  close: () => void;
};
const BottomSheetHeader = ({close}: TBottomSheetHeaderProps) => {
  return (
    <View style={styles.bottomSheetHeader}>
      <Pressable onPress={close} hitSlop={10}>
        <Text size="16" weight="medium" color="ELEMENT_ACCENT">
          Close
        </Text>
      </Pressable>
    </View>
  );
};

export default BottomSheetHeader;

const styles = StyleSheet.create({
  bottomSheetHeader: {
    paddingHorizontal: sizeScale(16),
    paddingVertical: sizeScale(12),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomColor: COLORS.BORDER_NEUTRAL_2,
    borderBottomWidth: sizeScale(1),
    alignItems: 'center',
  },
});
