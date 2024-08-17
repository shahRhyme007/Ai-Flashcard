// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXD1kQS5EYegwWYYDpBL-YW75ZZhnl9rQ",
  authDomain: "ai-flashcard-33bce.firebaseapp.com",
  projectId: "ai-flashcard-33bce",
  storageBucket: "ai-flashcard-33bce.appspot.com",
  messagingSenderId: "871383911885",
  appId: "1:871383911885:web:e18ff23632c8a733d54884",
  measurementId: "G-KCDYSKKT7B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 
