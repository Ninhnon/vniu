import { IMAGES } from '@assets/images';
import React, {useMemo} from 'react';

import {ImageBackground, ImageResizeMode, ViewStyle} from 'react-native';



interface ILayoutBackgroundImageLocalProps {
  children?: React.ReactNode;
  resizeMode?: ImageResizeMode;
  source: keyof typeof IMAGES;
  flex?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}
const LayoutBackgroundImageLocal = ({
  children,
  resizeMode = 'cover',
  source,
  flex,
  paddingHorizontal,
  paddingVertical,
}: ILayoutBackgroundImageLocalProps) => {
  const imageBackgroundStyle: ViewStyle = useMemo(() => {
    return {flex: flex, paddingHorizontal, paddingVertical};
  }, [flex, paddingHorizontal, paddingVertical]);

  return (
    <ImageBackground
      resizeMode={resizeMode}
      style={imageBackgroundStyle}
      source={IMAGES[source]}>
      {children}
    </ImageBackground>
  );
};
export default LayoutBackgroundImageLocal;
