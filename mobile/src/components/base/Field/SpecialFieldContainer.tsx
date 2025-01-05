import React from 'react';

import {StyleSheet, View} from 'react-native';

import {sizeScale} from '@utils/dimensions';

import {Layout} from '../Layout';
import Text from '../Text/Text';

interface ISpecialFieldContainerProps {
  children?: React.ReactNode;
  errorMessage?: string;
  helpMessage?: string;
}
const SpecialFieldContainer = ({
  children,
  errorMessage,
  helpMessage,
}: ISpecialFieldContainerProps) => {
  return (
    <Layout.Animated style={styles.container}>
      <View style={styles.childrenWrapperStyle}>{children}</View>
      {errorMessage && (
        <Text size="12" weight="light" color={'SEMANTIC_DANGER_1'}>
          {errorMessage}
        </Text>
      )}
      {helpMessage && (
        <Text size="12" weight="light" color={'SURFACE_ACCENT'}>
          {helpMessage}
        </Text>
      )}
    </Layout.Animated>
  );
};
export default SpecialFieldContainer;
const styles = StyleSheet.create({
  container: {gap: sizeScale(8)},
  childrenWrapperStyle: {
    height: sizeScale(80),
    justifyContent: 'center',
  },
});
