// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkk105LdD0QfJ5wDC9kLIJGuKVCncR7lo",
  authDomain: "medtimely-78c3e.firebaseapp.com",
  projectId: "medtimely-78c3e",
  storageBucket: "medtimely-78c3e.appspot.com",
  messagingSenderId: "309695981414",
  appId: "1:309695981414:android:8f4dcecd45358d051b8aa7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
