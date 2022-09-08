import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const SenderMessage = ({message}) => {
  return (
    <View
      style={{
        backgroundColor: '#9333ea',
        borderRadius: 8,
        borderTopRightRadius: 0,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        paddingBottom: 12,
        marginRight: 12,
        marginLeft: 12,
        marginTop: 8,
        marginBottom: 8,
        alignSelf: 'flex-start',
        marginLeft: 'auto',
      }}>
      <Text style={{color: 'white'}}>{message.message}</Text>
    </View>
  );
};

export default SenderMessage;

const styles = StyleSheet.create({});
