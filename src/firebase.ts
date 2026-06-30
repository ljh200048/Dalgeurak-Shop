import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA3nBhomUYT3_LEG4rRY9xLrKEoS1MUsdE",
  authDomain: "dallgrak-c0d82.firebaseapp.com",
  projectId: "dallgrak-c0d82",
  storageBucket: "dallgrak-c0d82.firebasestorage.app",
  messagingSenderId: "807808513797",
  appId: "1:807808513797:web:ba45e59e2fe41a3497e96c",
  measurementId: "G-5DFG78S29N"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence
});

// Initialize Firestore (uses default database)
export const db = getFirestore(app);
