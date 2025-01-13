import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface UserInformationCardProps {
  userName: string;
  phoneNumber: string;
  defaultAddress: string;
  onChangeAddress: () => void;
}
const UserInformationCard = ({
  userName,
  phoneNumber,
  defaultAddress,
  onChangeAddress,
}: UserInformationCardProps) => {
  const {colors} = useTheme();
  return (
    <View style={styles.card}>
      <Text style={[styles.title, {color: colors.text}]}>User Information</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'column'}}>
          <Text style={{color: colors.text}}>Name: {userName}</Text>
          <Text style={{color: colors.text}}>Phone Number: {phoneNumber}</Text>
          <Text style={{color: colors.text}}>Address: {defaultAddress}</Text>
        </View>
        <TouchableOpacity onPress={onChangeAddress} style={styles.button}>
          <Text style={{color: colors.text}}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default UserInformationCard;
