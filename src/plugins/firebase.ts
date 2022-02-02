import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, DocumentData, CollectionReference, collection } from 'firebase/firestore';
import { User, PaperCollection } from '../types/user';

// Firebase app config
const config = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
}

// Init our firebase app
initializeApp(config)

const db = getFirestore();
const auth = getAuth();

// If on localhost, use all firebase services locally
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8079);
  connectAuthEmulator(auth, "http://localhost:9099");
  // add more services as described in the docs: https://firebase.google.com/docs/emulator-suite/connect_firestore
}

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>
}
const usersCol = createCollection<User>('users')
const paperCollectionsCol = createCollection<PaperCollection>('paperCollections')

export { auth, db, paperCollectionsCol, usersCol }

