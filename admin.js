// Basic session check
const user = JSON.parse(localStorage.getItem("protrack_user"));

if (!user || user.role !== "admin") {
  alert("Unauthorized access");
  window.location.href = "login.html";
}

// Dummy admin actions
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    alert(`Admin action: ${btn.innerText}`);
  });
});

// ======================
// ADMIN DROPDOWN
// ======================

const toggle = document.getElementById("adminToggle");
const menu = document.getElementById("adminMenu");

toggle.addEventListener("click",(e)=>{
  e.stopPropagation();
  menu.classList.toggle("show");
});

// close when clicking outside
document.addEventListener("click",()=>{
  menu.classList.remove("show");
});

// logout action
document.getElementById("logoutBtn").addEventListener("click",()=>{
  localStorage.removeItem("protrack_user");
  window.location.href="login.html";
});