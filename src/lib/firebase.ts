
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnyEvJvzH4wGoJrP38v1_ZLtCJWiv4-kc",
  authDomain: "memoryforge.firebaseapp.com",
  projectId: "memoryforge",
  storageBucket: "memoryforge.firebasestorage.app", // Corrected from user snippet if it was different
  messagingSenderId: "646374712229",
  appId: "1:646374712229:web:ae9ff1c2b9224d6daf7e4c"
  // measurementId is optional, so if not provided, it's fine
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export { app as firebaseApp };
