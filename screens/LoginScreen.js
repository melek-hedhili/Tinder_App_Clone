import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useLayoutEffect} from 'react';
import useAuth from '../hooks/useAuth';
import {useNavigation} from '@react-navigation/core';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {WEB_CLIENT_KEY} from '@env';
const LoginScreen = () => {
  const navigation = useNavigation();
  const {signInWithGoogle, loading} = useAuth();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode="cover"
        style={{flex: 1}}
        source={{
          uri: 'https://tinder.com/static/tinder.png',
        }}>
        <View
          style={{
            alignItems: 'center',
            marginTop: 550,
          }}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signInWithGoogle}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
