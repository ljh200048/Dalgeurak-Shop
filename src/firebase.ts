import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBixc-qwtayr86ozUjVwnN_dGgTM4VIEdg",
  authDomain: "cheongchunfilm-mobile.firebaseapp.com",
  projectId: "cheongchunfilm-mobile",
  storageBucket: "cheongchunfilm-mobile.firebasestorage.app",
  messagingSenderId: "1095212470598",
  appId: "1:1095212470598:web:8fefe44ad11f9da1d1d547"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence
});

// Initialize Firestore with specific database ID if available
export const db = getFirestore(app, "ai-studio-2934e608-f2ef-4b72-adbd-988d5a00c3fb");
