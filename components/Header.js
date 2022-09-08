import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
const Header = ({title, callEnabled}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        padding: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{padding: 2}}>
          <Ionicons name="chevron-back-outline" size={34} color={'#FF5864'} />
        </TouchableOpacity>
        <Text style={{color: '#767676', fontWeight: 'bold', fontSize: 23}}>
          {title}
        </Text>
      </View>
      {callEnabled && (
        <TouchableOpacity style={{padding: 2}}>
          <Ionicons name="call-outline" size={34} color={'#FF5864'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
