// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MESUREMENT_ID,
  DB_URL,
} from '@env';
import {getAuth} from 'firebase/auth';

import {getFirestore, initializeFirestore} from 'firebase/firestore';
//import firebase realtime database from firebase

const firebaseConfig = {
  apiKey: 'AIzaSyDhCcKHroheMhN7jJrm_kXtyL5fkfvx2p8',
  authDomain: 'tinder-clone-4df13.firebaseapp.com',
  databaseURL: 'https://tinder-clone-4df13-default-rtdb.firebaseio.com',
  projectId: 'tinder-clone-4df13',
  storageBucket: 'tinder-clone-4df13.appspot.com',
  messagingSenderId: '17526967147',
  appId: '1:17526967147:web:3f0bd95cbde5086a621a2e',
  measurementId: 'G-7EWXF09ZV2',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export {auth, db};
