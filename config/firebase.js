// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA1coabnh5lI3l82iIFETeFwkAVrn5MpI",
  authDomain: "dev-assessment-34f74.firebaseapp.com",
  projectId: "dev-assessment-34f74",
  storageBucket: "dev-assessment-34f74.appspot.com",
  messagingSenderId: "675594458329",
  appId: "1:675594458329:web:e77c14b7a11d03c2ccdac8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
