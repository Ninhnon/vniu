import { Layout } from '@components/base';
import { appColors } from '@constants/appColors';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchHeaderHome = ({
    navigation
}:{
    navigation: any
}) => {
      const { colors } = useTheme()
    
    return (
        <Layout.Wrapper >
          {/* Birthday Banner */}
      <View style={styles.birthdayBanner}>
        <View>
          <Text style={styles.bannerTitle}>VNIU</Text>
        </View>
      </View>
            <View style={styles.searchContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SearchScreen')}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 52,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  backgroundColor:'#fff',
                  gap: 12
                }}
              >
                <EvilIcon name='search' size={24} color={colors.text} style={{ opacity: 0.5 }} />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: colors.text,
                    opacity: 0.5
                  }}
                >
                  Search
                </Text>
              </TouchableOpacity>
    
              <TouchableOpacity
                onPress={() => navigation.navigate('ImageSearch')}
                style={{
                  width: 52,
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 52,
                  backgroundColor:'#fff',                }}
              >
                <MaterialCommunityIcons name='image-search-outline' size={24} color='#333' />
              </TouchableOpacity>
            </View>
            </Layout.Wrapper>
    );
};
export default SearchHeaderHome;
const styles = StyleSheet.create({
  birthdayBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#007AFF', paddingTop: 16, paddingLeft:16 },
  bannerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  bannerSubtitle: { color: '#FFD700', fontSize: 14 },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor:'#007AFF',
    paddingVertical: 12,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.Primary
  },

  searchText: {
    marginLeft: 8,
    color: '#333'
  },
});