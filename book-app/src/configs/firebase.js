import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA1rMySw2I3ivTG3Op1YSjTSG9fUBK3c4U",
    authDomain: "qlda-6038b.firebaseapp.com",
    projectId: "qlda-6038b",
    storageBucket: "qlda-6038b.appspot.com",
    messagingSenderId: "404273090868",
    appId: "1:404273090868:web:7dfd8e78b920eb76415561",
    measurementId: "G-N9MSL22NSM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);