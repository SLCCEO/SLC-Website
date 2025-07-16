// Firebase imports (already added in HTML head, no need to import here)
const auth = firebase.auth();

// === Login Function ===
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Logged in
      const user = userCredential.user;
      console.log("Logged in:", user.email);
      alert("Login successful!");
      window.location.href = "home.html"; // redirect after login
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    });
});

// === Sign Up Function ===
document.getElementById("signupBtn").addEventListener("click", function () {
  const email = prompt("Enter email to register:");
  const password = prompt("Enter password (min 6 characters):");

  if (!email || !password) return alert("Please provide both fields.");

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Account created! Please log in.");
    })
    .catch((error) => {
      console.error("Signup error:", error.message);
      alert("Signup failed: " + error.message);
    });
});

// === Password Reset Function ===
document.getElementById("forgotPassword").addEventListener("click", function () {
  const email = prompt("Enter your email to reset password:");

  if (!email) return;

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent.");
    })
    .catch((error) => {
      console.error("Reset error:", error.message);
      alert("Reset failed: " + error.message);
    });
});

const db = firebase.firestore(); // Add this near top with auth

// === Updated Sign Up Function with Role Storage ===
document.getElementById("signupBtn").addEventListener("click", function () {
  const email = prompt("Enter email to register:");
  const password = prompt("Enter password (min 6 characters):");
  const role = prompt("Enter role (admin/developer/viewer):"); // Or assign default

  if (!email || !password || !role) return alert("All fields are required.");

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Store role in Firestore
      return db.collection("users").doc(user.uid).set({
        email: user.email,
        role: role
      });
    })
    .then(() => {
      alert("Account created and role assigned! Please log in.");
    })
    .catch((error) => {
      console.error("Signup error:", error.message);
      alert("Signup failed: " + error.message);
    });
});

auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    return db.collection("users").doc(user.uid).get();
  })
  .then((doc) => {
    if (doc.exists) {
      const userData = doc.data();
      console.log("User Role:", userData.role);

      // Optionally store role in localStorage or sessionStorage
      localStorage.setItem("userRole", userData.role);

      alert(`Login successful! Role: ${userData.role}`);
      window.location.href = "home.html";
    } else {
      alert("No user role found.");
    }
  })
  .catch((error) => {
    console.error("Login error:", error.message);
    alert("Login failed: " + error.message);
  });
