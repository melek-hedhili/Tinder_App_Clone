import {
  View,
  Text,
  Button,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import {onSnapshot, orderBy, query, collection} from 'firebase/firestore';
import {db} from '../firebase';

const ChatRow = ({matchDetails}) => {
  const navigation = useNavigation();

  const {user} = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState('');
  useEffect(() => {
    console.log('hi');
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    console.log(matchedUserInfo);
  }, [matchDetails, user]);
  useEffect(() =>
    onSnapshot(
      query(
        collection(db, 'matches', matchDetails.id, 'messages'),
        orderBy('timestamp', 'desc'),
      ),
      snapshot => setLastMessage(snapshot.docs[0]?.data()?.message),
    ),
  ),
    [matchDetails, user];

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Message', {matchDetails})}
      style={[
        {
          flexDirection: 'row',
          width: '90%',
          alignSelf: 'center',
          paddingBottom: 3,
          paddingTop: 3,
          paddingLeft: 5,
          paddingRight: 5,
          backgroundColor: 'white',
          marginTop: 1,
          marginBottom: 1,
          borderRadius: 8,
        },
        styles.cardShadow,
      ]}>
      <Image
        style={{borderRadius: 999, height: 64, width: 64, marginRight: 10}}
        source={{uri: matchedUserInfo?.photoURL}}
      />
      <View>
        <Text style={{color: '#767676', fontSize: 18, fontWeight: 'bold'}}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text style={{color: '#767676'}}>{lastMessage || 'Say Hi !'}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
