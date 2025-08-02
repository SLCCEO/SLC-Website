document.getElementById("upload-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const file = document.getElementById("fileInput").files[0];
  const status = document.getElementById("upload-status");

  if (!file) {
    status.textContent = "No file selected.";
    return;
  }

  // Simulated upload for now
  status.textContent = `Uploading ${file.name}...`;

  setTimeout(() => {
    status.textContent = "Upload successful (simulated).";
  }, 1500);
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  // Add Firebase signOut logic if needed
  window.location.href = "login.html";
});