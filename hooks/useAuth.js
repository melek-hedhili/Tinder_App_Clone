import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {WEB_CLIENT_KEY} from '@env';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from '@firebase/auth';
import {auth} from '../firebase';
import {async} from '@firebase/util';
const AuthContext = createContext({});
GoogleSignin.configure({
  webClientId: WEB_CLIENT_KEY,
});

export const AuthProvider = ({children}) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  // const getCurrentUser = async () => {
  //   const currentUser = await GoogleSignin.getCurrentUser();
  //   console.log('currentUser', currentUser);
  // };
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoadingInitial(false);
    });
  }, []);
  const logOut = async () => {
    setLoading(true);

    signOut(auth)
      .then(user => {
        console.log('user signed out');
        setUser(null);
      })
      .catch(error => {
        console.log('error signing out', error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {idToken} = userInfo;

      if (idToken) {
        const credential = GoogleAuthProvider.credential(userInfo.idToken);
        await signInWithCredential(auth, credential)
          .then(user => {
            console.log('user', user);
          })
          .catch(error => {
            console.log('errors', error);
          });
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.log(error);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };
  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle,
      logOut,
    }),
    [user, loading, error],
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};
export default function useAuth() {
  return useContext(AuthContext);
}
