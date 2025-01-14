import {Layout} from '@components/base';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TryOnBanner = ({navigation}: {navigation: any}) => {
  const {colors} = useTheme();

  return (
    <Layout.Wrapper>
      <View style={styles.iconContainer}>
        {/* Collage Button */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('GlassTryOn')}>
          <MaterialCommunityIcons name="glasses" size={40} color="#1C86EE" />
          <Text style={[styles.text, {color: '#007AFF'}]}>Glass Try On</Text>
        </TouchableOpacity>

        {/* Album Button */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ShoeTryOn')}>
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
          <MaterialCommunityIcons
            name="shoe-sneaker"
            size={40}
            color="#1C86EE"
          />
          <Text style={[styles.text, {color: '#007AFF'}]}>Shoe Try On</Text>
        </TouchableOpacity>

        {/* AI Generator Button */}
        <TouchableOpacity style={styles.card}>
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
          <MaterialCommunityIcons
            name="tshirt-crew-outline"
            size={40}
            color="#1C86EE"
          />
          <Text style={[styles.text, {color: '#007AFF'}]}>Cloth Try On</Text>
        </TouchableOpacity>
      </View>
    </Layout.Wrapper>
  );
};
export default TryOnBanner;
const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BFFF',
    margin: 8,
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  comingSoonContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
