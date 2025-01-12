import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PriceDisplay = ({discountedPrice, originalPrice}) => {
  return (
    <View style={styles.container}>
      {/* Discounted Price */}
      <Text style={styles.discountedPrice}>${discountedPrice}</Text>

      {/* Discount Percentage */}
      <View style={styles.discountContainer}>
        <Text style={styles.discountText}>
          -
          {(((originalPrice - discountedPrice) * 100) / originalPrice).toFixed(
            2,
          )}
          %
        </Text>
      </View>

      {/* Original Price */}
      <Text style={styles.originalPrice}>${originalPrice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    marginRight: 8,
  },
  discountContainer: {
    backgroundColor: '#f0f0f0', // Light gray background
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  discountText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 16,
    color: 'gray',
    textDecorationLine: 'line-through',
  },
});

export default PriceDisplay;
