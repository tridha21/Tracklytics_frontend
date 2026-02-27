// ======================
// SESSION CHECK
// ======================
const user = JSON.parse(localStorage.getItem("protrack_user"));

if (!user || user.role !== "student") {
  alert("Unauthorized access");
  window.location.href = "login.html";
}

// ======================
// VIEW PROJECT REDIRECT
// ======================
const viewBtn = document.getElementById("viewProjectBtn");

if (viewBtn) {
  viewBtn.addEventListener("click", () => {
    window.location.href = "student-project.html";
  });
}

// ======================
// STUDENT DROPDOWN MENU
// ======================
const menuBtn = document.getElementById("studentMenuBtn");
const dropdown = document.getElementById("studentDropdown");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdown.classList.toggle("show");
});

// Close dropdown on outside click
document.addEventListener("click", () => {
  dropdown.classList.remove("show");
});

// ======================
// DROPDOWN ACTIONS
// ======================
document.getElementById("myGroupBtn").addEventListener("click", () => {
  window.location.href = "student-group.html";
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("protrack_user");
  window.location.href = "login.html";
});