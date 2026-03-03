// ======================
// SESSION CHECK
// ======================
const user = JSON.parse(localStorage.getItem("protrack_user"));

if (!user || user.role !== "STUDENT") {
    alert("Unauthorized access");
    window.location.href = "login.html";
}

const studentId = user.id;

// ======================
// LOAD PAGE
// ======================
document.addEventListener("DOMContentLoaded", loadLeaderPage);

async function loadLeaderPage() {

    try {

        // 🔥 1️⃣ Get project of student (MAIN SOURCE OF TRUTH)
        const projectRes = await fetch(
            `http://localhost:7000/api/projects/student/${studentId}`
        );

        if (!projectRes.ok) throw new Error("Project fetch failed");

        const projects = await projectRes.json();

        if (!projects.length) {
            localStorage.removeItem("currentGroupId");
            window.location.href = "student-group.html";
            return;
        }

        // If multiple exist, use latest
        const project = projects.sort(
            (a, b) => new Date(b.uploadAt) - new Date(a.uploadAt)
        )[0];

        const group = project.group;

        if (!group) {
            throw new Error("Group not linked to project");
        }

        // 🔥 2️⃣ Leader validation
        if (Number(group.createdBy.userId) !== Number(studentId)) {
            window.location.href = "student-project.html";
            return;
        }

        // 🔥 Store current groupId properly
        localStorage.setItem("currentGroupId", group.groupId);

        renderGroup(project);
        loadMembers(group.groupId);

    } catch (error) {
        console.error("Leader page error:", error);
        alert("Failed to load group");
    }
}

// ======================
// RENDER GROUP
// ======================
function renderGroup(project) {

    const group = project.group;

    // Title from PROJECT
    document.querySelector(".page-header h1").innerText = project.title;

    document.querySelector(".breadcrumb").innerHTML =
        `<a href="HomeStudent.html">Home</a> › ${project.title}`;

    // Invite code from GROUP
    document.getElementById("inviteCode").innerText = group.groupCode;

    document.querySelector(".page-header p").innerText =
        `Share this invite code with your friends (Max: ${group.maxMembers} Members)`;
}

// ======================
// LOAD MEMBERS
// ======================
async function loadMembers(groupId) {

    const res = await fetch(
        `http://localhost:7000/api/group-members/group/${groupId}`
    );

    const members = await res.json();

    const teamSection =
        document.querySelector(".group-container .card:nth-of-type(2)");

    teamSection.innerHTML = "<h3>Team Members</h3>";

    members.forEach(member => {

        const isLeader =
            member.user.userId === studentId;

        const div = document.createElement("div");
        div.className = "member-row";

        div.innerHTML = `
            <div class="member-info">
                <img src="image/user.png" />
                <div>
                    <strong>${member.user.userEmail}</strong>
                    <span>${isLeader ? "Group Leader" : "Member"}</span>
                </div>
            </div>
        `;

        teamSection.appendChild(div);
    });

    // Remove static approval section
    document.querySelector(".group-container .card:first-of-type")
        .innerHTML = `
        <h3>Approval Requests</h3>
        <p class="empty">No pending requests found.</p>
    `;
}

// ======================
// EXIT GROUP
// ======================
document.querySelector(".exit-btn")
.addEventListener("click", async () => {

    if (!confirm("Delete this group permanently?")) return;

    const groupId = localStorage.getItem("currentGroupId");

    try {

        // 1️⃣ Get project of this group
        const projRes = await fetch(
            `http://localhost:7000/api/projects/student/${studentId}`
        );

        const projects = await projRes.json();

        const project = projects.find(
            p => p.group.groupId == groupId
        );

        if (project) {
            // 2️⃣ Delete project first
            await fetch(
                `http://localhost:7000/api/projects/${project.projectId}`,
                { method: "DELETE" }
            );
        }

        // 3️⃣ Delete group
        await fetch(
            `http://localhost:7000/api/groups/${groupId}`,
            { method: "DELETE" }
        );

        // 4️⃣ Clear local storage
        localStorage.removeItem("currentGroupId");

        window.location.href = "student-group.html";

    } catch (error) {
        console.error(error);
        alert("Failed to exit group");
    }
});

// ======================
// COPY INVITE
// ======================
document.getElementById("copyBtn")
.addEventListener("click", () => {

    const code =
        document.getElementById("inviteCode").innerText;

    navigator.clipboard.writeText(code);
    alert("Invite code copied!");
});