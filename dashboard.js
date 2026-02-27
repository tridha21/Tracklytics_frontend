// Basic session check (optional)
const user = JSON.parse(localStorage.getItem("protrack_user"));

if (!user) {
  // window.location.href = "login.html";
  console.warn("No user session found");
}

// Example dynamic behavior
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    console.log("Clicked:", btn.innerText);
  });
});

// ======================
// PROJECT PROGRESS CHART
// ======================

// 🔥 Fake counts for now (later replace with API data)
const completedProjects = 5;
const progressProjects = 4;
const pendingProjects = 2;

document.getElementById("cNum").innerText = completedProjects;
document.getElementById("pNum").innerText = progressProjects;
document.getElementById("penNum").innerText = pendingProjects;

new Chart(document.getElementById("projectChart"),{
type:"doughnut",
data:{
labels:["Completed","In Progress","Pending"],
datasets:[{
data:[completedProjects,progressProjects,pendingProjects],
backgroundColor:["#A8DF8E","#A0DEFF","#FF5555"],
borderWidth:0
}]
},
options:{
plugins:{legend:{display:false}},
cutout:"65%"
}
});

// ======================
// GUIDE DROPDOWN MENU
// ======================

const toggle = document.getElementById("userToggle");
const menu = document.getElementById("guideMenu");

toggle.addEventListener("click",(e)=>{
    e.stopPropagation();
    menu.classList.toggle("show");
});

// close when clicking outside
document.addEventListener("click",()=>{
    menu.classList.remove("show");
});

// logout
document.getElementById("logoutBtn").addEventListener("click",()=>{
    localStorage.removeItem("protrack_user");
    window.location.href="login.html";
});

// ======================
// VIEW PROJECT REDIRECT
// ======================

document.querySelectorAll(".view-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        // later you can pass project id here
        window.location.href = "evaluate-project.html";

    });

});


