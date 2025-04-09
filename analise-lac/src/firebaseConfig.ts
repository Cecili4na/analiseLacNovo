import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDdNnQFQ04Pcszsc9xZiq6qwyyrMszEt8Y",
  authDomain: "analise-b39de.firebaseapp.com",
  projectId: "analise-b39de",
  storageBucket: "analise-b39de.firebasestorage.app",
  messagingSenderId: "685477663321",
  appId: "1:685477663321:web:3ba7ef37caecde6ab65748",
  measurementId: "G-EZGVH2QFHM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { app, db }; 