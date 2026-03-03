// ======================
// ACCESS CHECK
// ======================
const user = JSON.parse(localStorage.getItem("protrack_user"));

if (!user || user.role !== "STUDENT") {
    alert("Unauthorized access");
    window.location.href = "login.html";
}

const studentId = user.id;

if (!studentId) {
    alert("Session expired. Please login again.");
    window.location.href = "login.html";
}

// ======================
// LOAD PROJECT
// ======================
document.addEventListener("DOMContentLoaded", loadProject);

async function loadProject() {
    try {
        const response = await fetch(
            `http://localhost:7000/api/projects/student/${studentId}`
        );

        if (!response.ok) {
            throw new Error("No project found");
        }

        const projects = await response.json();

        if (!projects.length) {
            alert("You are not part of any project.");
            window.location.href = "student-group.html";
            return;
        }

        const project = projects[0];

        renderProject(project);

        loadMembers(project.group.groupId);

    } catch (error) {
        console.error(error);
        alert("Project not found.");
        window.location.href = "student-group.html";
    }
}

// ======================
// RENDER PROJECT INFO
// ======================
function renderProject(project) {

    // Update title
    document.querySelector(".page-header h1").innerText = project.title;

    // Update breadcrumb
    document.querySelector(".breadcrumb").innerHTML =
        `<a href="HomeStudent.html">Home</a> › ${project.title}`;

    // Update project details section
    document.querySelector(".project-info strong").innerText = project.title;

    // You can update guide later dynamically if needed
}

// ======================
// LOAD TEAM MEMBERS
// ======================
async function loadMembers(groupId) {
    try {
        const response = await fetch(
            `http://localhost:7000/api/group-members/group/${groupId}`
        );

        if (!response.ok) throw new Error();

        const members = await response.json();

        const teamSection = document.querySelector(".card:nth-of-type(4)");
        const container = teamSection.querySelectorAll(".member");

        // Remove static members
        teamSection.innerHTML = "<h3>Team Members</h3>";

        members.forEach(member => {

            const div = document.createElement("div");
            div.className = "member";

            div.innerHTML = `
                <img src="image/user.png" />
                <div>
                    <strong>${member.user.userEmail}</strong>
                    <span>Student</span>
                </div>
            `;

            teamSection.appendChild(div);
        });

    } catch (error) {
        console.error("Failed to load members");
    }
}

// ======================
// KEEP YOUR EXISTING CHART LOGIC
// ======================
const tasks = document.querySelectorAll(".tasks li");

let completed = 0;
let progress = 0;
let pending = 0;

tasks.forEach(t => {
    if (t.classList.contains("done")) completed++;
    if (t.classList.contains("progress")) progress++;
    if (t.classList.contains("pending")) pending++;
});

const total = tasks.length || 1;

const cPercent = Math.round((completed / total) * 100);
const pPercent = Math.round((progress / total) * 100);
const penPercent = Math.round((pending / total) * 100);

document.getElementById("cVal").innerText = cPercent + "%";
document.getElementById("pVal").innerText = pPercent + "%";
document.getElementById("penVal").innerText = penPercent + "%";

new Chart(document.getElementById("progressChart"), {
    type: "doughnut",
    data: {
        labels: ["Completed", "In Progress", "Pending"],
        datasets: [{
            data: [cPercent, pPercent, penPercent],
            backgroundColor: ["#A8DF8E", "#A0DEFF", "#FF5555"],
            borderWidth: 0
        }]
    },
    options: {
        plugins: { legend: { display: false } },
        cutout: "65%"
    }
});