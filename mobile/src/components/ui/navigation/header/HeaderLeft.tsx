import {useAppNavigation} from '@hooks/app/useAppNavigation';

import React, {useCallback} from 'react';

import {StyleSheet, TouchableOpacity} from 'react-native';

import {SvgIcon} from '@components/base';

import {sizeScale} from '@utils/dimensions';

interface IHeaderLeftProps {
  onPress?: () => void;
}

const HeaderLeft = ({onPress}: IHeaderLeftProps) => {
  const {goBack} = useAppNavigation();
  const _handleGoBack = useCallback(() => {
    goBack();
  }, [goBack]);
  return (
    <TouchableOpacity
      onPress={onPress || _handleGoBack}
      hitSlop={12}
      style={styles.button}>
      <SvgIcon name="arrowLeft" size={20} fill="ELEMENT_ACCENT" />
    </TouchableOpacity>
  );
};

export default HeaderLeft;

const styles = StyleSheet.create({
  button: {
    width: sizeScale(28),
    height: sizeScale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
