// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ocr-app-89ef4.firebaseapp.com",
  projectId: "ocr-app-89ef4",
  storageBucket: "ocr-app-89ef4.appspot.com",
  messagingSenderId: "796969897396",
  appId: "1:796969897396:web:713aafa3af0cd9cfabb6e1",
  measurementId: "G-099F5ZBNMD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);