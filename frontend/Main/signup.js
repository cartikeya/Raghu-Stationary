document.addEventListener("DOMContentLoaded", () => {
    // OTP Button Click Event
    document.getElementById("sendOtp").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        if (!email) return alert("Please enter an email");

        console.log("Sending OTP request to:", email); // Debugging

        try {
            const response = await fetch("http://localhost:9999/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            console.log("OTP Response:", data);
            alert(data.message);
        } catch (error) {
            console.error("OTP Error:", error);
            alert("Failed to send OTP");
        }
    });

    // Signup Form Submission
    document.querySelector(".signup-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const otp = document.getElementById("otp").value;

        if (!email || !otp || !username || !password) {
            return alert("Please fill in all fields.");
        }

        console.log("Verifying OTP for:", email); // Debugging

        try {
            // Step 1: Verify OTP
            const otpResponse = await fetch("http://localhost:9999/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const otpData = await otpResponse.json();
            console.log("OTP Verification Response:", otpData);

            if (!otpResponse.ok) return alert(otpData.error);

            // Step 2: Proceed with Registration
            console.log("Registering user:", username);

            const signupResponse = await fetch("http://localhost:9999/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const signupData = await signupResponse.json();
            console.log("Signup Response:", signupData);

            if (signupResponse.ok) {
                alert("Account Created Successfully!");
                window.location.href = "index.html"; // Redirect to login
            } else {
                alert(signupData.error);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Something went wrong!");
        }
    });
});