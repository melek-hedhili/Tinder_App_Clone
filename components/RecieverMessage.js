import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const RecieverMessage = ({message}) => {
  return (
    <View
      style={{
        backgroundColor: '#F87117',
        borderRadius: 8,
        borderTopLeftRadius: 0,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        paddingBottom: 12,
        marginRight: 12,
        marginLeft: 12,
        marginTop: 8,
        marginBottom: 8,
        alignSelf: 'flex-start',
        marginLeft: 56,
      }}>
      <Image
        style={{
          height: 48,
          width: 48,
          borderRadius: 999,
          position: 'absolute',
          top: 0,
          left: -50,
        }}
        source={{uri: message.photo}}
      />
      <Text style={{color: 'white'}}>{message.message}</Text>
    </View>
  );
};

export default RecieverMessage;

const styles = StyleSheet.create({});
