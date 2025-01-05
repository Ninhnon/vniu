import React, { useMemo } from 'react'

import { Text as RNText, ViewStyle } from 'react-native'

import { FONTS_SIZE_HASH_MAP } from './constants'
import { TTextProps } from './type'
import { COLORS } from '@assets/color'
import { useTheme } from '@react-navigation/native'

const Text = ({
  children,
  size = '14',
  weight = 'medium',
  color = 'ELEMENT_BASE',
  center,
  onPress,
  style,
  ...props
}: TTextProps) => {
  const { colors } = useTheme()

  const textStyle: ViewStyle[] = useMemo(() => {
    return [
      {
        color: COLORS[color],
        textAlign: center ? 'center' : 'auto',
        ...FONTS_SIZE_HASH_MAP[size],
      },
      style || {}
    ]
  }, [center, color, size, style, weight])
  return (
    <RNText style={textStyle} onPress={onPress} disabled={!onPress} {...props}>
      {children}
    </RNText>
  )
}
export default Text
