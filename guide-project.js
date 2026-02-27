const projects = [
  {
    title:"IoT Smart Campus",
    domain:"IoT",
    status:"In Progress",
    date:"April 20, 2024",
    team:"Alice, Bob, Fiona"
  },
  {
    title:"AI-Based Medical Diagnosis System",
    domain:"AI",
    status:"Pending",
    date:"April 18, 2024",
    team:"David, Sarah, Michael"
  },
  {
    title:"Renewable Energy Management",
    domain:"Energy",
    status:"Completed",
    date:"April 16, 2024",
    team:"Jessica, Mark, Adrian"
  },
  {
    title:"Smart Waste Management System",
    domain:"Environmental",
    status:"In Progress",
    date:"April 14, 2024",
    team:"Brian, Emily, Chris"
  }
];

const grid = document.getElementById("projectGrid");

function statusClass(status){
  if(status==="Completed") return "completed";
  if(status==="Pending") return "pending";
  return "inprogress";
}

function render(list){
  grid.innerHTML="";
  list.forEach(p=>{
    grid.innerHTML+=`
      <div class="card">
        <div class="card-header">
          <h3>${p.title}</h3>
          <span class="status ${statusClass(p.status)}">${p.status}</span>
        </div>

        <div class="meta"><b>Domain:</b> ${p.domain}</div>
        <div class="meta"><b>Last Modified:</b> ${p.date}</div>
        <div class="meta"><b>Team:</b> ${p.team}</div>

        <button class="evaluate-btn">Evaluate ›</button>
      </div>
    `;
  });
}

render(projects);

/* ===== FILTER + SEARCH ===== */

function applyFilter(){
  const domain=document.getElementById("domainFilter").value;
  const status=document.getElementById("statusFilter").value;
  const search=document.getElementById("searchInput").value.toLowerCase();

  const filtered=projects.filter(p=>{
    return (domain==="all"||p.domain===domain)
    &&(status==="all"||p.status===status)
    &&(p.title.toLowerCase().includes(search));
  });

  render(filtered);
}

document.getElementById("domainFilter").onchange=applyFilter;
document.getElementById("statusFilter").onchange=applyFilter;
document.querySelector(".search-btn").onclick=applyFilter;