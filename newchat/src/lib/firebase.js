import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf2w-AJvsfQSyMjIuRx4K1_zVatexNhEw",
  authDomain: "reactchat-422cf.firebaseapp.com",
  projectId: "reactchat-422cf",
  storageBucket: "reactchat-422cf.appspot.com",
  messagingSenderId: "798557753940",
  appId: "1:798557753940:web:af4fefa5802a4f6f50d3c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

