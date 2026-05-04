import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      msg: "User registered successfully",
      user,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({
      msg: "Signup failed",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({
      msg: "Login successful",
      user,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({
      msg: "Login failed",
      error: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name email role");

    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Failed to fetch users",
      error: error.message,
    });
  }
};