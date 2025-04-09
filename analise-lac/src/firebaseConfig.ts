import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

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
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, db }; 