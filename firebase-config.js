import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB...", // À REMPLACER PAR VOTRE CLÉ API
    authDomain: "mariage-ilana-isaac.firebaseapp.com",
    projectId: "mariage-ilana-isaac",
    storageBucket: "mariage-ilana-isaac.appspot.com",
    messagingSenderId: "367375682843",
    appId: "1:367375682843:web:..." 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Make db available globally for faire-part.js
window.db = db;
window.addDoc = addDoc;
window.collection = collection;

