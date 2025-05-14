// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfgayyA3uX6r1I-THobosCN-Xe9IxSi2U",
  authDomain: "ai-interview-20a89.firebaseapp.com",
  projectId: "ai-interview-20a89",
  storageBucket: "ai-interview-20a89.firebasestorage.app",
  messagingSenderId: "769519639916",
  appId: "1:769519639916:web:354ab97f430d537fe72749",
  measurementId: "G-288L6EP173"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Initialize Firestore


export { db };
