import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import useAuth from '../hooks/useAuth';
import {serverTimestamp, setDoc, doc} from 'firebase/firestore';
import {db} from '../firebase';
import {useNavigation} from '@react-navigation/native';

const ModalScreen = () => {
  const {user} = useAuth();
  const navigation = useNavigation();
  const [age, setAge] = useState(null);
  const [job, setJob] = useState(null);
  const [image, setImage] = useState(null);
  const incompleteForm = !age || !job || !image;
  const updateUserProfile = () => {
    setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        console.log('saved');
        navigation.navigate('Home');
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Image
        resizeMode="contain"
        source={{uri: 'https://links.papareact.com/2pf'}}
        style={{width: '100%', height: '10%'}}
      />
      <Text
        style={{
          color: '#767676',
          marginTop: 30,
          fontSize: 24,
          fontWeight: 'bold',
        }}>
        Welcome {user.displayName}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#EF9A9A',
          marginTop: 30,
        }}>
        Step 1: The profile Pic
      </Text>
      <TextInput
        placeholderTextColor={'#767676'}
        placeholder="Enter a profile Pic URL"
        onChangeText={setImage}
        value={image}
        style={{color: '#767676', textAlign: 'center'}}
      />
      <Text
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#EF9A9A',
          marginTop: 10,
        }}>
        Step 2: The Job
      </Text>
      <TextInput
        placeholderTextColor={'#767676'}
        value={job}
        placeholder="Enter your occupation"
        onChangeText={setJob}
        style={{color: '#767676', textAlign: 'center'}}
      />
      <Text
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#EF9A9A',
          marginTop: 10,
        }}>
        Step 3: The Age
      </Text>
      <TextInput
        placeholderTextColor={'#767676'}
        value={age}
        placeholder="Enter your age"
        onChangeText={setAge}
        style={{color: '#767676', textAlign: 'center'}}
      />

      <TouchableOpacity
        onPress={updateUserProfile}
        disabled={incompleteForm}
        style={{
          width: '50%',
          height: '6%',
          borderRadius: 10,
          backgroundColor: incompleteForm ? '#BDBDBD' : '#EF9A9A',
          marginTop: 50,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
          }}>
          Update Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({});
