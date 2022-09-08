// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAFING_SENDER_ID,
  APP_ID,
  MESUREMENT_ID,
} from '@env';
import {getAuth} from 'firebase/auth';

import {getFirestore, initializeFirestore} from 'firebase/firestore';
//import firebase realtime database from firebase

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAFING_SENDER_ID,
  appId: APP_ID,
  measurementId: MESUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export {auth, db};
