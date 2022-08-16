// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB67R9SssXcsV9ArEoX6LbANSdCa5FDYzM",
  authDomain: "jiffty.firebaseapp.com",
  projectId: "jiffty",
  storageBucket: "jiffty.appspot.com",
  messagingSenderId: "371678001991",
  appId: "1:371678001991:web:3e241a478906c4c02cea62",
  measurementId: "G-42WJTTE0V6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
getAnalytics(app);