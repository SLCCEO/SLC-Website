import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Firebase config (environment variables via Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const userProfile = document.getElementById("userProfile");
const nicknameEl = document.getElementById("nickname");
const profilePic = document.getElementById("profilePic");
const documentsList = document.getElementById("documentsList");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;

    // Fetch user profile data from "profiles" collection
    const userDocRef = doc(db, "profiles", uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      nicknameEl.textContent = data.nickname || user.email;
      profilePic.src = data.profilePicture || "default.png";
    } else {
      nicknameEl.textContent = user.email;
    }

    // Load view-only documents from "documents" collection
    const docsSnap = await getDocs(collection(db, "documents"));
    documentsList.innerHTML = "";

    docsSnap.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "doc-card";
      div.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.content}</p>
      `;
      documentsList.appendChild(div);
    });

  } else {
    window.location.href = "/login.html"; // redirect if not logged in
  }
});