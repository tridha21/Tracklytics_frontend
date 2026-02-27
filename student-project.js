// ======================
// STUDENT ACCESS CHECK
// ======================
const user = JSON.parse(localStorage.getItem("protrack_user"));

if (!user || user.role !== "student") {
  alert("Unauthorized access");
  window.location.href = "login.html";
}


// ======================
// CALCULATE TASK %
/* counts classes:
   .done
   .progress
   .pending
*/
const tasks = document.querySelectorAll(".tasks li");

let completed = 0;
let progress = 0;
let pending = 0;

tasks.forEach(t=>{
  if(t.classList.contains("done")) completed++;
  if(t.classList.contains("progress")) progress++;
  if(t.classList.contains("pending")) pending++;
});

const total = tasks.length || 1;

const cPercent = Math.round((completed/total)*100);
const pPercent = Math.round((progress/total)*100);
const penPercent = Math.round((pending/total)*100);

document.getElementById("cVal").innerText = cPercent+"%";
document.getElementById("pVal").innerText = pPercent+"%";
document.getElementById("penVal").innerText = penPercent+"%";


// ======================
// DOUGHNUT CHART
// ======================
new Chart(document.getElementById("progressChart"),{
type:"doughnut",
data:{
labels:["Completed","In Progress","Pending"],
datasets:[{
data:[cPercent,pPercent,penPercent],
backgroundColor:["#A8DF8E","#A0DEFF","#FF5555"],
borderWidth:0
}]
},
options:{
plugins:{legend:{display:false}},
cutout:"65%"
}
});