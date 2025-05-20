import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "bostongene-electricity.firebaseapp.com",
  projectId: "bostongene-electricity",
  storageBucket: "bostongene-electricity.firebasestorage.app",
  messagingSenderId: "217548469714",
  appId: "1:217548469714:web:051cdff6aed09e8bff040b"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);