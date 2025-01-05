import React from 'react';

import {StyleSheet, View} from 'react-native';

import {Show, Text} from '@components/base';

import {sizeScale} from '@utils/dimensions';

import {COLORS} from '@assets/color';

import HeaderLeft from './HeaderLeft';

interface IAppHeaderProps {
  title?: string;
  renderHeaderRight?: () => React.ReactNode;
  renderHeaderLeft?: () => React.ReactNode;
  renderHeaderCenter?: () => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  isShowBottomBorder?: boolean;
}
const AppHeader = ({
  renderHeaderCenter,
  renderHeaderLeft,
  renderHeaderRight,
  title,
  renderHeader,
}: IAppHeaderProps) => {
  if (renderHeader) {
    return renderHeader();
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerLeftWrapper}>
        <Show>
          <Show.When isTrue={!!renderHeaderLeft}>
            {renderHeaderLeft && renderHeaderLeft()}
          </Show.When>
          <Show.Else>
            <HeaderLeft />
          </Show.Else>
        </Show>
      </View>
      <Show.When isTrue={!!renderHeaderCenter || !!title}>
        <View style={styles.headerCenterWrapper}>
          <Show>
            <Show.When isTrue={!!renderHeaderCenter}>
              {renderHeaderCenter && renderHeaderCenter()}
            </Show.When>
            <Show.Else>
              <Text size="16" weight="medium" color="ELEMENT_BASE" center>
                {title}
              </Text>
            </Show.Else>
          </Show>
        </View>
      </Show.When>

      <View style={styles.headerRightWrapper}>
        <Show.When isTrue={!!renderHeaderRight}>
          {renderHeaderRight && renderHeaderRight()}
        </Show.When>
      </View>
    </View>
  );
};
export default AppHeader;
const styles = StyleSheet.create({
  headerCenterWrapper: {
    flex: 2,
    alignSelf: 'center',
  },
  headerLeftWrapper: {
    flex: 1,
  },
  headerRightWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  container: {
    height: sizeScale(60),
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: sizeScale(16),
    backgroundColor: COLORS.SURFACE_OFF_WHITE,
  },
});
