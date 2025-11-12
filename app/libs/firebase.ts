// src/firebase.ts
import { getApps, getApp, initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config (from your message)
const firebaseConfig = {
  apiKey: 'AIzaSyDwzuaRgm1cf7nmx6F1MHQWvRwjc0Tv43U',
  authDomain: 'expo-app-mobile-class.firebaseapp.com',
  projectId: 'expo-app-mobile-class',
  storageBucket: 'expo-app-mobile-class.firebasestorage.app',
  messagingSenderId: '1078899718074',
  appId: '1:1078899718074:web:4ff4148f0526b17e908f83',
  measurementId: 'G-M5BKLFWFXF', // fine to keep, just not used in RN
};

// Reuse if hot-reloaded
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth: ensure React Native persistence
let auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // If already initialized (e.g., after hot reload)
    return getAuth(app);
  }
})();

const db = getFirestore(app);

export { app, auth, db };
