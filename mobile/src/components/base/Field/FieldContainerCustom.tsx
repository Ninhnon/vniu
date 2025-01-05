import React from 'react';

import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {sizeScale} from '@utils/dimensions';

interface IFieldContainerCustomProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const FieldContainerCustom = ({children}: IFieldContainerCustomProps) => {
  return <View style={styles.childrenWrapper}>{children}</View>;
};

export default FieldContainerCustom;

const styles = StyleSheet.create({
  childrenWrapper: {
    flexDirection: 'row',
    paddingHorizontal: sizeScale(12),
    alignItems: 'center',
    width: '100%',
  },
});
