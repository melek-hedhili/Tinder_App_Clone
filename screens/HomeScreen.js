import {
  View,
  Text,
  Button,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useLayoutEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/core';
import useAuth, {signOut} from '../hooks/useAuth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Swiper from 'react-native-deck-swiper';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDocs,
  query,
  where,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {db} from '../firebase';
import {useState} from 'react';
import {useEffect} from 'react';
import generateId from '../lib/generateId';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const {logOut, user} = useAuth();
  const swiperRef = useRef(null);
  useLayoutEffect(
    () =>
      onSnapshot(doc(db, 'users', user.uid), snapshot => {
        if (!snapshot.data()) {
          navigation.navigate('Modal');
        }
      }),

    [],
  );
  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, 'users', user.uid, 'passes'),
      ).then(snapshot => snapshot.docs.map(doc => doc.id));
      const swipes = await getDocs(
        collection(db, 'users', user.uid, 'swipes'),
      ).then(snapshot => snapshot.docs.map(doc => doc.id));
      const passedUserIds = passes.length > 0 ? passes : ['test'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

      unsub = onSnapshot(
        query(
          collection(db, 'users'),
          where('id', 'not-in', [...passedUserIds, ...swipedUserIds]),
        ),
        snapshot => {
          setProfiles(
            snapshot.docs
              .filter(doc => doc.id !== user.uid)
              .map(doc => ({...doc.data(), id: doc.id})),
          );
        },
      );
    };
    fetchCards();
    return unsub;
  }, [db]);
  const swipeLeft = async cardIndex => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];

    console.log(`You swiped pass on ${userSwiped.displayName}`);
    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
  };
  const swipeRight = async cardIndex => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];

    const loggedInProfile = await (
      await getDoc(doc(db, 'users', user.uid))
    ).data();

    //check if the user swiped on you
    getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then(
      documentSnapshot => {
        if (documentSnapshot.data()) {
          //user matched with you before the matched you
          //create a match
          console.log(` You MATCHED with ${userSwiped.displayName}`);
          setDoc(
            doc(db, 'users', user.uid, 'swipes', userSwiped.id),
            userSwiped,
          );

          setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          navigation.navigate('Match', {
            loggedInProfile,
            userSwiped,
          });
        } else {
          console.log(`You swiped match on ${userSwiped.displayName}`);
          setDoc(
            doc(db, 'users', user.uid, 'swipes', userSwiped.id),
            userSwiped,
          );
        }
      },
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          marginHorizontal: 5,
          marginVertical: 5,
        }}>
        <TouchableOpacity onPress={logOut}>
          <Image
            source={{uri: user.photoURL}}
            style={{
              width: 35,
              height: 35,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: '#FF5864',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
          <Image
            source={require('../assets/logo.png')}
            style={{
              width: 50,
              height: 50,
              borderRadius: 30,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles-sharp" size={30} color={'#FF5864'} />
        </TouchableOpacity>
      </View>
      <View>
        <Swiper
          ref={swiperRef}
          containerStyle={{backgroundColor: 'transparent'}}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          onSwipedLeft={cardIndex => {
            swipeLeft(cardIndex);
          }}
          onSwipedRight={cardIndex => {
            console.log('MATCH');
            swipeRight(cardIndex);
          }}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  textAlign: 'right',
                  color: 'red',
                },
              },
            },
            right: {
              title: 'MATCH',

              style: {
                label: {
                  color: '#4DED40',
                },
              },
            },
          }}
          renderCard={card =>
            card ? (
              <View
                key={card.id}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderRadius: 30,
                }}>
                <Image
                  source={{uri: card.photoURL}}
                  style={{
                    width: '80%',
                    height: '80%',
                    borderRadius: 30,
                  }}
                />
                <View style={styles.cardShadow}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        color: '#141823',
                      }}>
                      {card.displayName}
                    </Text>
                    <Text style={{fontSize: 15, color: '#141823'}}>
                      {'  '} {card.job}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      alignSelf: 'center',
                      color: '#141823',
                    }}>
                    {card.age}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    borderRadius: 30,
                  }}>
                  <Image
                    source={{
                      uri: 'https://img.icons8.com/ios/452/cancel-2.png',
                    }}
                    style={{
                      width: '80%',
                      height: '80%',
                      borderRadius: 30,
                      resizeMode: 'contain',
                    }}
                  />
                  <View style={styles.cardShadow}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 20,
                          color: '#141823',
                        }}>
                        No more swipes
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )
          }
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: 10,
          marginTop: 'auto',
        }}>
        <TouchableOpacity
          onPress={() => {
            swiperRef.current.swipeLeft();
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            width: 50,
            height: 50,
            backgroundColor: '#EF9A9A',
          }}>
          <Entypo name="cross" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            swiperRef.current.swipeRight();
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 30,
            width: 50,
            height: 50,
            backgroundColor: '#A5D6A7',
          }}>
          <Entypo name="heart" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
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
