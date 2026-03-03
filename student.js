// ======================
// SESSION CHECK
// ======================
const user = JSON.parse(localStorage.getItem("protrack_user"));

if (!user || user.role !== "STUDENT") {
  alert("Unauthorized access");
  window.location.href = "login.html";
}

const studentId = user.id; // ✅ FIXED

// ======================
// LOAD STUDENT PROJECTS
// ======================
document.addEventListener("DOMContentLoaded", () => {
  loadStudentProjects();
});

async function loadStudentProjects() {
  try {
    const response = await fetch(
      `http://localhost:7000/api/projects/student/${studentId}` // ✅ FIXED
    );

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const projects = await response.json();

    if (!projects || projects.length === 0) {
      showNoGroupState();
      return;
    }

    // 🔥 If user has project → redirect immediately
    const latestProject = projects.sort(
      (a, b) => new Date(b.uploadAt) - new Date(a.uploadAt)
    )[0];

    // Store groupId for consistency
    if (latestProject.group?.groupId) {
      localStorage.setItem("currentGroupId", latestProject.group.groupId);
    }

    renderProject(latestProject);

  } catch (error) {
    console.error("Error loading project:", error);
    showNoGroupState();
  }
}

// ======================
// RENDER PROJECT
// ======================
function renderProject(project) {

  document.querySelector(".group-info").innerHTML = `
    <h4>${project.title}</h4>
    <p>Guide: ${project.group?.guide?.userName || "Not Assigned"}</p>
    <p>Group Code: ${project.group?.groupCode || "N/A"}</p>
    <p>Status: <strong>${project.status}</strong></p>
  `;

  document.querySelector(".ideas").innerHTML = `
    <li>
      <span class="icon">📌</span>
      <span>Status: ${project.status}</span>
    </li>
    <li>
      <span class="icon">📅</span>
      <span>Uploaded: ${formatDate(project.uploadAt)}</span>
    </li>
  `;

  document.querySelector(".projects").innerHTML = `
    <div class="project">
      <img src="image/p1.png" />
      <h4>${project.fileUpload || "No File Uploaded"}</h4>
      ${
        project.fileLink
          ? `<a href="${project.fileLink}" target="_blank">
                <button>Download</button>
             </a>`
          : `<button disabled>No File</button>`
      }
    </div>
  `;

  const viewBtn = document.getElementById("viewProjectBtn");
  viewBtn.innerText = "View Details";
  viewBtn.onclick = () => {
    window.location.href = "student-project.html";
  };
}

// ======================
// NO GROUP STATE
// ======================
function showNoGroupState() {

  document.querySelector(".group-info").innerHTML = `
      <h4>No Project Assigned</h4>
      <p>You are not part of any project group yet.</p>
  `;

  document.querySelector(".ideas").innerHTML = `
      <li>
        <span class="icon">⚠️</span>
        <span>No submissions yet</span>
      </li>
  `;

  document.querySelector(".projects").innerHTML = `
      <div class="project">
        <h4>No Files Available</h4>
      </div>
  `;

  const viewBtn = document.getElementById("viewProjectBtn");
  viewBtn.innerText = "Join Group";
  viewBtn.onclick = () => {
    window.location.href = "student-group.html";
  };
}

// ======================
// FORMAT DATE
// ======================
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// ======================
// DROPDOWN
// ======================
const menuBtn = document.getElementById("studentMenuBtn");
const dropdown = document.getElementById("studentDropdown");

if (menuBtn) {
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });
}

document.addEventListener("click", () => {
  dropdown.classList.remove("show");
});

// ======================
// DROPDOWN ACTIONS
// ======================
document.getElementById("myGroupBtn")?.addEventListener("click", () => {
  window.location.href = "student-group.html";
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("protrack_user");
  localStorage.removeItem("currentGroupId");
  window.location.href = "login.html";
});