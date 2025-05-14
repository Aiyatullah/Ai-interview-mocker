// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu5gLyCa0NAuNHcQ-z10PvZb5G7AmVoYs",
  authDomain: "ai-interview-mocker-a9d05.firebaseapp.com",
  projectId: "ai-interview-mocker-a9d05",
  storageBucket: "ai-interview-mocker-a9d05.firebasestorage.app",
  messagingSenderId: "946667289499",
  appId: "1:946667289499:web:32291c6801ec8ad9327f3e",
  measurementId: "G-XHGGM1DD3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Initialize Firestore


export { db };
