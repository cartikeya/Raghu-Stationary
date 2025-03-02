document.querySelector(".signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    
    document.getElementById("sendOtp").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
    
        if (!email) return alert("Please enter an email");
    
        const response = await fetch("http://localhost:9999/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
    
        const data = await response.json();
        alert(data.message);
    });

    try {
        const response = await fetch("http://localhost:9999/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        console.log("Response:", data);

        if (data.message) {
            alert("Account Created Successfully!");
            window.location.href = "index.html";  // Redirect to login page
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
    }
});