import {StyleSheet, TextStyle} from 'react-native';

import {sizeScale} from '@utils/dimensions';

import {TTextSize, TTextWeight} from './type';


export const FONTS_SIZE_HASH_MAP: {[n in TTextSize]: TextStyle} =
  StyleSheet.create({
    '11': {
      fontSize: sizeScale(11),
      lineHeight: sizeScale(14),
    },
    '12': {
      fontSize: sizeScale(12),
      lineHeight: sizeScale(18),
    },
    '14': {
      fontSize: sizeScale(14),
      lineHeight: sizeScale(20),
    },
    '16': {
      fontSize: sizeScale(16),
      lineHeight: sizeScale(22),
    },

    '18': {
      fontSize: sizeScale(18),
      lineHeight: sizeScale(24),
    },
    '20': {
      fontSize: sizeScale(20),
      lineHeight: sizeScale(36),
    },
    '24': {
      fontSize: sizeScale(24),
      lineHeight: sizeScale(30),
    },
    '30': {
      fontSize: sizeScale(30),
      lineHeight: sizeScale(34),
    },
    '36': {
      fontSize: sizeScale(36),
      lineHeight: sizeScale(40),
    },
    '48': {
      fontSize: sizeScale(48),
      lineHeight: sizeScale(60),
    },
    '60': {
      fontSize: sizeScale(60),
      lineHeight: sizeScale(72),
    },
  });

export const ICON_SIZE_HASH_MAP: {[n: string]: number} = {
  '14': 16,
  '18': 20,
};
