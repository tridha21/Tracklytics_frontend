// ======================
// ACCESS CONTROL
// ======================
const user = JSON.parse(localStorage.getItem("protrack_user"));

if (!user || user.role !== "student") {
  alert("Unauthorized access");
  window.location.href = "login.html";
}



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