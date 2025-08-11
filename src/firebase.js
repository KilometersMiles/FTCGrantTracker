import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDEg9xLbeJVgJlK6f4uE06E33loRSbauVc",
  authDomain: "granttracker-b00fe.firebaseapp.com",
  projectId: "granttracker-b00fe",
  storageBucket: "granttracker-b00fe.firebasestorage.app",
  messagingSenderId: "552380052953",
  appId: "1:552380052953:web:6025fb99f7f9d9838115c8",
  measurementId: "G-2TV34VRF9W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, analytics };