// ======================
// SESSION CHECK
// ======================
const user = JSON.parse(localStorage.getItem("protrack_user"));

if (!user || user.role !== "student") {
  alert("Unauthorized access");
  window.location.href = "login.html";
}

// ======================
// DROPDOWN
// ======================
const menuBtn = document.getElementById("studentMenuBtn");
const dropdown = document.getElementById("studentDropdown");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("show");
});

document.addEventListener("click", () => {
  dropdown.classList.remove("show");
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("protrack_user");
  window.location.href = "login.html";
});

// ======================
// COPY INVITE CODE
// ======================
document.getElementById("copyBtn").addEventListener("click", () => {
  const code = document.getElementById("inviteCode").innerText;
  navigator.clipboard.writeText(code);
  alert("Invite code copied!");
});

// ======================
// CLOSE ALERT
// ======================
document.querySelector(".alert .close").addEventListener("click", () => {
  document.querySelector(".alert").style.display = "none";
});