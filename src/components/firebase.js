// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFCLVroVCLbBbeqee8MOwYIUVfkig16U8",
  authDomain: "skyliferesearch.firebaseapp.com",
  projectId: "skyliferesearch",
  storageBucket: "skyliferesearch.firebasestorage.app",
  messagingSenderId: "146721535454",
  appId: "1:146721535454:web:2b5fe5d2355b852d81194f",
  measurementId: "G-YF6V10XR9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth=getAuth(app);
export default app;