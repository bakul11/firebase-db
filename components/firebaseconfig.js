import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCIIwTxF3wLUxi7jLZ1q0zYDWQ5JknXPpo",
    authDomain: "next-pro-3fb67.firebaseapp.com",
    projectId: "next-pro-3fb67",
    storageBucket: "next-pro-3fb67.appspot.com",
    messagingSenderId: "15228228191",
    appId: "1:15228228191:web:b0643a9606eaafb43001ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);