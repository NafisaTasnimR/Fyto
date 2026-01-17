// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import firebase from 'firebase/compat/app';
import { GoogleAuthProvider } from "firebase/auth";
const firebase_api = process.env.REACT_APP_FIREBASE_API_KEY;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: firebase_api,
    authDomain: "fyto-a0621.firebaseapp.com",
    projectId: "fyto-a0621",
    storageBucket: "fyto-a0621.firebasestorage.app",
    messagingSenderId: "47392661636",
    appId: "1:47392661636:web:c56a85be447905d78062d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };