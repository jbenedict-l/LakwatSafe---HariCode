// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA0QJY16vSNzSW108VBTYOZ-bK2kU2PT8E",
  authDomain: "lakwatsafe.firebaseapp.com",
  projectId: "lakwatsafe",
  storageBucket: "lakwatsafe.firebasestorage.app",
  messagingSenderId: "646168608601",
  appId: "1:646168608601:web:b3668f68af892a1dc1d648",
  measurementId: "G-8F100R29RP"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
