// Initialize Firebase – make sure firebase-config.js is loaded before this file
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ----------------- SIGN-UP FUNCTION -----------------
export function signUp(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Sign-up successful! You can now log in.");
      console.log("Signed up:", userCredential.user);
    })
    .catch((error) => {
      console.error("Sign-up error:", error.message);
      alert("Sign-up failed: " + error.message);
    });
}

// ----------------- LOGIN FUNCTION -----------------
export function login(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    });
}

// ----------------- LOGOUT FUNCTION -----------------
export function logout() {
  signOut(auth)
    .then(() => {
      alert("Logged out!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout error:", error.message);
    });
}

// ----------------- AUTH STATE LISTENER -----------------
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log("User role:", data.role);
        // You can use the role value here as needed
        // For example: redirect, show/hide UI, etc.
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  } else {
    console.log("User is logged out");
  }
});