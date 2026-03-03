document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");


    const KIIT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@kiit\.ac\.in$/;

    function showError(input, message) {
        clearError(input);
        const error = document.createElement("small");
        error.className = "error-text";
        error.innerText = message;
        input.parentElement.appendChild(error);
        input.parentElement.classList.add("error");
    }

    function clearError(input) {
        const parent = input.parentElement;
        const error = parent.querySelector(".error-text");
        if (error) error.remove();
        parent.classList.remove("error");
    }

    function setLoading(isLoading) {
        loginBtn.disabled = isLoading;
        loginBtn.innerText = isLoading ? "Logging in..." : "Log In";
    }

    function validate() {
        let valid = true;

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        if (email === "") {
            showError(emailInput, "Email is required");
            valid = false;
        } else if (!KIIT_EMAIL_REGEX.test(email)) {
            showError(emailInput, "Only @kiit.ac.in email IDs are allowed");
            valid = false;
        }

        if (password === "") {
            showError(passwordInput, "Password is required");
            valid = false;
        }

        return valid;
    }

    emailInput.addEventListener("input", () =>
        clearError(emailInput)
    );

    passwordInput.addEventListener("input", () =>
        clearError(passwordInput)
    );

    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearError(emailInput);
    clearError(passwordInput);

    if (!validate()) return;

    setLoading(true);

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    try {
        const response = await fetch("http://localhost:7000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error("Invalid email or password");
        }

        const user = await response.json();

        // ⚠️ Remove password if backend sends it
        delete user.password;

        // Save logged user
        localStorage.setItem("protrack_user", JSON.stringify(user));

        // Role-based redirect
        if (user.role === "ADMIN") {
            window.location.href = "HomeAdmin.html";
        } 
        else if (user.role === "GUIDE") {
            window.location.href = "HomeGuide.html";
        } 
        else if (user.role === "STUDENT") {
            window.location.href = "HomeStudent.html";
        } 
        else {
            throw new Error("Unknown role");
        }

    } catch (error) {
        showError(passwordInput, error.message);
    } finally {
        setLoading(false);
    }
});
});