// range display
const range = document.getElementById("progressRange");
const val = document.getElementById("rangeVal");

val.innerText = range.value;

range.addEventListener("input",()=>{
val.innerText = range.value;
});


// star ratings
document.querySelectorAll(".star-group").forEach(group=>{

for(let i=1;i<=5;i++){

const star=document.createElement("i");
star.className="fa-solid fa-star star";

star.addEventListener("click",()=>{
group.dataset.value=i;

group.querySelectorAll(".star").forEach((s,idx)=>{
s.classList.toggle("active",idx<i);
});

});

group.appendChild(star);
}

});

// ======================
// GUIDE DROPDOWN
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