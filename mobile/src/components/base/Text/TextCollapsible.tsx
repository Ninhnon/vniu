import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {useMemo, useState} from 'react';
import React from 'react';

import {
  Platform,
  Pressable,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';


import {COLORS} from '@assets/color';

import LinearGradient from '../LinearGradient/LinearGradient';
import Text from './Text';
import {FONTS_SIZE_HASH_MAP} from './constants';
import {TTextProps} from './type';

const comment =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et augue risus. Nullam sit amet nulla et nunc volutpat maximus sit amet ut sem. Pellentesque in bibendum nisl, eu bibendum lorem. Nam tincidunt arcu nec tincidunt rhoncus. Integer varius nulla at laoreet lobortis. Vestibulum a odio placerat, malesuada justo eu, rhoncus diam. Fusce ut nunc orci. Praesent dictum ornare placerat. Fusce augue nibh, fermentum nec tellus vitae, tristique efficitur nulla. Vivamus ornare euismod luctus. Nullam felis ex, tincidunt non justo sed, varius congue magna. ';

export default function TextCollapsible({
  children = comment,
  size = '12',
  weight = 'light',
  color = 'ELEMENT_BASE_2',
  style,
  minLines = 2,
  lineHeightText = '18',
}: TTextProps) {
  const lineHeight = parseInt(lineHeightText, 10);
  const [showMore, setShowMore] = useState(false);
  const [maxLines, setMaxLines] = useState(minLines);
  const currentLines = useSharedValue(minLines);
  const {height} = useWindowDimensions();
  const [linesCalculated, setLinesCalculated] = useState(
    Platform.OS==='ios' ? false : true,
  );
  const handleToggle = () => {
    const newVal = !showMore;
    currentLines.value = withTiming(newVal ? maxLines : minLines);
    setShowMore(newVal);
  };
  const animStyle = useAnimatedStyle(() => {
    return {
      overflow: 'hidden',
      height: !linesCalculated ? height : currentLines.value * lineHeight,
    };
  });
  const textStyle: ViewStyle[] = useMemo(() => {
    return [
      {
        color: COLORS[color],
        ...FONTS_SIZE_HASH_MAP[size],
        lineHeight: lineHeight,
        overflow: 'visible',
      },
      style || {},
    ];
  }, [color, lineHeight, size, style, weight]);

  const opacityStyle: ViewStyle = useMemo(() => {
    const heightSize = parseInt(size, 10) * 2;
    return {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: !showMore ? heightSize : 0,
    };
  }, [showMore, size]);

  const isShowLinerGradient = maxLines > minLines && !showMore;
  return (
    <View>
      <Pressable onPress={handleToggle} disabled={maxLines < minLines}>
        <Animated.View style={animStyle}>
          <Text
            style={textStyle}
            onTextLayout={e => {
              if (Platform.OS === 'android') {
                setMaxLines(e.nativeEvent.lines.length);
              }
              if ( Platform.OS==='ios' && !linesCalculated) {
                setMaxLines(e.nativeEvent.lines.length);
                setLinesCalculated(true);
              }
            }}>
            {children}
          </Text>
        </Animated.View>
        {isShowLinerGradient && (
          <LinearGradient
            colors={['rgba(252, 252, 252, 0)', 'rgba(252, 252, 252, 1)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={opacityStyle}
          />
        )}
      </Pressable>
    </View>
  );
}
