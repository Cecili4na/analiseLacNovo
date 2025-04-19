import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBKTNeM1-WiHOdUQgwLVh8vkCpKlXPbp6k",
  authDomain: "analise-lac.firebaseapp.com",
  projectId: "analise-lac",
  storageBucket: "analise-lac.firebasestorage.app",
  messagingSenderId: "158207345969",
  appId: "1:158207345969:web:3a7e842116501d94bc5c10",
  measurementId: "G-F56R8SED93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Analytics only if supported
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { app, db, auth, analytics }; 