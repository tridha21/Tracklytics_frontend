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
// CHECK IF ALREADY IN GROUP
// ======================
document.addEventListener("DOMContentLoaded", async () => {

    const res = await fetch(
        `http://localhost:7000/api/projects/student/${studentId}`
    );

    const projects = await res.json();

    if (projects.length) {
        // Already in group → store groupId and redirect
        const project = projects[0];
        localStorage.setItem("currentGroupId", project.group.groupId);
        window.location.href = "student-group-leader.html";
    }
});

// ======================
// TEAM SIZE SELECTION
// ======================
let selectedSize = null;

document.querySelectorAll(".team-size button").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".team-size button")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
        selectedSize = btn.getAttribute("data-size");
    });
});

// ======================
// CREATE GROUP
// ======================
document.getElementById("createGroupBtn")
?.addEventListener("click", async () => {

    const title = document.getElementById("projectTitle").value.trim();

    if (!title) {
        alert("Enter project title");
        return;
    }

    if (!selectedSize) {
        alert("Select team size");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("studentId", studentId);
    formData.append("maxMembers", selectedSize);
    formData.append("title", title);

    try {
        const response = await fetch(
            "http://localhost:7000/api/groups/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData.toString()
            }
        );

        if (!response.ok) {
            throw new Error("Failed to create group");
        }

        const group = await response.json();

        // 🔥 Store current groupId
        localStorage.setItem("currentGroupId", group.groupId);

        window.location.href = "student-group-leader.html";

    } catch (error) {
        alert(error.message);
    }
});

// ======================
// JOIN GROUP
// ======================
document.getElementById("joinGroupBtn")
?.addEventListener("click", async () => {

    const code = document.getElementById("inviteCode")
        .value.trim().toUpperCase();

    if (!code) {
        alert("Enter invite code");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("studentId", studentId);
    formData.append("groupCode", code);

    try {
        const response = await fetch(
            "http://localhost:7000/api/groups/join",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData.toString()
            }
        );

        if (!response.ok) {
            throw new Error("Join failed");
        }

        // After join, fetch group by invite code
        const allGroups = await fetch(
            "http://localhost:7000/api/groups"
        );

        const groups = await allGroups.json();

        const joinedGroup = groups.find(g => g.groupCode === code);

        localStorage.setItem("currentGroupId", joinedGroup.groupId);

        window.location.href = "student-project.html";

    } catch (error) {
        alert(error.message);
    }
});