const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const tempUsers = new Map();

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    tempUsers.set(email, { name, email, password: hashedPassword, role, otp: generatedOtp });

    // Send the email using Mailtrap's HTTP API (Bypasses Render's port blocks!)
    const response = await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MAILTRAP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: { email: "hello@demomailtrap.co", name: "Agri-Chain Team" },
        to: [{ email: email }], 
        subject: "Verify your Agri-Chain Account 🚜",
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <h2 style="color: #059669;">Welcome to Agri-Chain, ${name}! 🌱</h2>
              <p style="color: #4b5563;">Your 4-digit verification code is:</p>
              <h1 style="color: #34d399; letter-spacing: 8px; font-size: 36px; background-color: #ecfdf5; padding: 15px; border-radius: 10px; display: inline-block;">${generatedOtp}</h1>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">Please enter this code on the verification screen to activate your account.</p>
          </div>
        `,
        category: "OTP Verification"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🚨 MAILTRAP REJECTED:", errorText);
      throw new Error("Mailtrap API rejected the request.");
    }

    res.status(200).json({ message: "OTP sent! Please check your email inbox." });
  } catch (error) {
    console.error("🚨 REGISTRATION ERROR:", error);
    res.status(500).json({ error: "Registration failed." });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = tempUsers.get(email);

    if (!tempUser) return res.status(404).json({ error: "OTP expired or invalid email." });
    if (tempUser.otp !== otp) return res.status(400).json({ error: "Invalid OTP code." });

    const newUser = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
      isVerified: true,
      otp: null
    });

    tempUsers.delete(email);

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: "Verification successful! Account created.", token });
  } catch (error) {
    res.status(500).json({ error: "Verification failed." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp');
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
};

module.exports = { registerUser, verifyOtp, loginUser, getMe };