require('dotenv').config({ path: require("path").resolve(__dirname, ".env") });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require("nodemailer");
const otpStorage = new Map(); // Temporary OTP storage (better to use Redis for production)

const app = express();
const PORT = 9999;
app.use(express.json());
app.use(cors());

console.log("MongoDB URI:", process.env.MONGO_URI); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB error",err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // ✅ Replace with your email
        pass: process.env.EMAIL_PASS,    // ✅ Use an "App Password" (not your main password)
    },
});

const sendOTP = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    otpStorage.set(email, otp); // Store OTP temporarily

    await transporter.sendMail({
        from: '"Raghu stationary" cartikeya.official@gmail.com',
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    console.log(`OTP sent to ${email}: ${otp}`);
};
// send route 
app.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    console.log("OTP request received for:", email); // Debugging


    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    await sendOTP(email);
    res.json({ message: "OTP sent successfully!" });
});
//verify route
app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (otpStorage.get(email) == otp) {
        otpStorage.delete(email); // Remove OTP after successful verification
        res.json({ message: "OTP verified successfully!" });
    } else {
        res.status(400).json({ error: "Invalid or expired OTP" });
    }
});
// Register Route
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if user already exists (by email or username)
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ error: "Email already exists" });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ error: "Username already taken" });
            }
        }

        // Hash the password before saving (optional but recommended)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
    res.json({ message: "Login successful!", token });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
    res.send("Welcome to the Raghu stationary API!");
});