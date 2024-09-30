// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbRYKAk__pY4pHQpfu-JihMrc4BVZocK8",
  authDomain: "hangsquare-c6f12.firebaseapp.com",
  projectId: "hangsquare-c6f12",
  storageBucket: "hangsquare-c6f12.appspot.com",
  messagingSenderId: "721250351930",
  appId: "1:721250351930:web:c9bf9bd39a3c897462ae03",
  measurementId: "G-LQEGKVHCFE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const ImgDb = getStorage(app)