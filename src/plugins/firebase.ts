import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, DocumentData, CollectionReference, collection } from 'firebase/firestore';

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

export const firestore = getFirestore()
export const auth = getAuth();

// If on localhost, use all firebase services locally
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(firestore, 'localhost', 8079);
  connectAuthEmulator(auth, "http://localhost:9099");
  // add more services as described in the docs: https://firebase.google.com/docs/emulator-suite/connect_firestore
}

// Taken from: https://javascript.plainenglish.io/using-firestore-with-typescript-in-the-v9-sdk-cf36851bb099
const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>
}

import { UserData, PaperCollection } from '@/types/userTypes';
import { ZoteroData } from '../types/zoteroTypes';
export const usersCol = createCollection<UserData>('users')
export const zoteroDataCol = createCollection<ZoteroData>('zoteroData')
export const paperCollectionsCol = createCollection<PaperCollection>('paperCollections')

