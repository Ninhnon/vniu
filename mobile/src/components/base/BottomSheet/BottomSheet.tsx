import ActionSheet, {
  ActionSheetProps,
  ActionSheetRef,
} from 'react-native-actions-sheet';

import React, {PropsWithChildren, forwardRef} from 'react';

import {SafeAreaView, StyleSheet, View} from 'react-native';

import {sizeScale} from '@utils/dimensions';

import {COLORS} from '@assets/color';

export type TBottomSheetRef = ActionSheetRef;
type TBottomSheetProps = PropsWithChildren<
  {
    gestureEnabled?: boolean;
  } & ActionSheetProps
>;
const BottomSheet = forwardRef<TBottomSheetRef, TBottomSheetProps>(
  (
    {children, gestureEnabled, snapPoints, ...props}: TBottomSheetProps,
    ref,
  ) => {
    return (
      <ActionSheet
        isModal
        keyboardHandlerEnabled
        ref={ref}
        gestureEnabled={gestureEnabled}
        containerStyle={styles.background}
        CustomHeaderComponent={gestureEnabled && <BottomSheetHeaderCustom />}
        {...props}>
        {children}
        <SafeAreaView />
      </ActionSheet>
    );
  },
);

export default BottomSheet;

const BottomSheetHeaderCustom = () => {
  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.handlerBar} />
    </View>
  );
};

const headerStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: sizeScale(13),
    paddingBottom: sizeScale(9),
  },
  handlerBar: {
    width: sizeScale(40),
    height: sizeScale(3),
    backgroundColor: COLORS.BORDER_ACCENT_3,
  },
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: COLORS.SURFACE_OFF_WHITE,
    borderBottomWidth: 0,
    borderColor: COLORS.ELEMENT_BASE_2,
    borderTopLeftRadius: sizeScale(16),
    borderTopRightRadius: sizeScale(16),
  },
});
