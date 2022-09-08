import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

const MatchedScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const {loggedInProfile, userSwiped} = params;

  return (
    <View
      style={{
        backgroundColor: '#ff6666',
        opacity: 0.89,
        flex: 1,
        justifyContent: 'center',
      }}>
      <View style={{justifyContent: 'center'}}>
        <Image
          source={{uri: 'https://links.papareact.com/mg9'}}
          style={{resizeMode: 'contain', width: '100%', height: '30%'}}
        />
      </View>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          marginTop: 5,
          fontSize: 15,
        }}>
        You and {userSwiped.displayName} have linked each other!
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: '20%',
        }}>
        <Image
          source={{uri: loggedInProfile.photoURL}}
          style={{width: 150, height: 150, borderRadius: 100}}
        />
        <Image
          source={{uri: userSwiped.photoURL}}
          style={{width: 150, height: 150, borderRadius: 100}}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Chat')}
        style={{
          backgroundColor: 'white',
          margin: 5,
          padding: 10,
          borderRadius: 50,
          marginTop: '20%',
          alignItems: 'center',
          justifyContent: 'center',
          height: '10%',
        }}>
        <Text style={{color: 'black'}}>Send a Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchedScreen;
