import {StyleSheet, TextStyle, ViewStyle} from 'react-native';

import {sizeScale} from '@utils/dimensions';

import {TIconButtonSize, TSize} from './types';

export const buttonStyleSize: {[n in TSize]: ViewStyle} = StyleSheet.create({
  '56': {
    borderRadius: sizeScale(16),
    paddingHorizontal: sizeScale(24),
    gap: sizeScale(12),
    height: sizeScale(56),
  },
  '44': {
    borderRadius: sizeScale(12),
    paddingHorizontal: sizeScale(24),
    gap: sizeScale(8),
    height: sizeScale(44),
  },
  '36': {
    borderRadius: sizeScale(12),
    paddingHorizontal: sizeScale(16),
    gap: sizeScale(8),
    height: sizeScale(36),
  },
});
export const labelStyleSize: {[n in TSize]: TextStyle} = StyleSheet.create({
  '56': {
    fontSize: sizeScale(18),
    lineHeight: sizeScale(28),
  },
  '44': {
    fontSize: sizeScale(16),
    lineHeight: sizeScale(24),
  },
  '36': {
    fontSize: sizeScale(14),
    lineHeight: sizeScale(20),
  },
});

export const iconsSize: {[n in TSize]: number} = {
  '56': 24,
  '44': 20,
  '36': 18,
};

export const iconButtonStyleSize: {[n in TIconButtonSize]: ViewStyle} =
  StyleSheet.create({
    '32': {
      borderRadius: sizeScale(16),
      width: sizeScale(32),
      height: sizeScale(32),
      justifyContent: 'center',
      alignItems: 'center',
    },
    '36': {
      borderRadius: sizeScale(12),
      width: sizeScale(36),
      height: sizeScale(36),
      justifyContent: 'center',
      alignItems: 'center',
    },
    '40': {
      borderRadius: sizeScale(12),
      width: sizeScale(36),
      height: sizeScale(36),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export const iconButtonSize: {[n in TIconButtonSize]: number} = {
  '32': 16,
  '36': 20,
  '40': 24,
};
