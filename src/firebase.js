import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDrNH6do9vMphl-EKaPVtBbB7aTZZAMsUM",
  authDomain: "jetzone24-96bba.firebaseapp.com",
  databaseURL:
    "https://jetzone24-96bba-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jetzone24-96bba",
  storageBucket: "jetzone24-96bba.firebasestorage.app",
  messagingSenderId: "1049650034134",
  appId: "1:1049650034134:web:03e28d7be5379ba4e26077",
  measurementId: "G-98Q2E79ET2",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
