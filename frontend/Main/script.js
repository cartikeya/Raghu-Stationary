document.querySelector(".login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("input[type='text']").value;
    const password = document.querySelector("input[type='password']").value;

    const response = await fetch("http://localhost:9999/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.token) {
        alert("Login Successful!");
        localStorage.setItem("token", data.token); // Save login session
    } else {
        alert(data.error);
    }
});