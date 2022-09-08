import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Button,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import React from 'react';
import Header from '../components/Header';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';
import {useRoute} from '@react-navigation/native';
import {useState, useEffect} from 'react';
import SenderMessage from '../components/SenderMessage';
import RecieverMessage from '../components/RecieverMessage';
import {db} from '../firebase';
import {
  serverTimestamp,
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
const MessagesScreen = () => {
  const {user} = useAuth();
  const {params} = useRoute();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const {matchDetails} = params;

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'matches', matchDetails.id, 'messages'),
          orderBy('timestamp', 'desc'),
        ),
        snapshot =>
          setMessages(snapshot.docs.map(doc => ({...doc.data(), id: doc.id}))),
      ),
    [matchDetails, db],
  );

  const sendMessage = () => {
    addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photo: matchDetails.users[user.uid].photoURL,
      message: input,
    });
    setInput('');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        title={getMatchedUserInfo(matchDetails.users, user.uid).displayName}
        callEnabled
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={50}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            inverted={-1}
            data={messages}
            style={{paddingLeft: 4}}
            keyExtractor={item => item.id}
            renderItem={({item: message}) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <RecieverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopWidth: 1,
            paddingTop: 2,
            paddingBottom: 2,
            paddingRight: 5,
            paddingLeft: 5,
            borderColor: '#e7ebe5',
            backgroundColor: 'white',
          }}>
          <TextInput
            placeholderTextColor={'#767676'}
            style={{height: 40, fontSize: 18, lineHeight: 20, color: '#767676'}}
            placeholder="Send Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button onPress={sendMessage} title="Send" color={'#FF5864'} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({});
