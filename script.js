document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");

    // Allowed users (email-based)
    const USERS = {
        "student@kiit.ac.in": {
            role: "student",
            password: "student123",
            redirect: "HomeStudent.html"
        },
        "guide@kiit.ac.in": {
            role: "guide",
            password: "guide123",
            redirect: "HomeGuide.html"
        },
        "admin@kiit.ac.in": {
            role: "admin",
            password: "admin123",
            redirect: "HomeAdmin.html"
        }
    };

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

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        clearError(emailInput);
        clearError(passwordInput);

        if (!validate()) return;

        setLoading(true);

        setTimeout(() => {
            const email = emailInput.value.trim().toLowerCase();
            const password = passwordInput.value.trim();

            const user = USERS[email];

            if (!user || user.password !== password) {
                showError(passwordInput, "Invalid email or password");
                setLoading(false);
                return;
            }

            // Save session
            localStorage.setItem(
                "protrack_user",
                JSON.stringify({
                    email,
                    role: user.role
                })
            );

            // ✅ REDIRECT (THIS WILL NOW WORK)
            window.location.href = user.redirect;

        }, 800);
    });
});