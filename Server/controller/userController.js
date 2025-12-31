import User from "../model/userModel.js";
import bcrypt from "bcrypt";

// Login with password validation
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare passwords if using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Return user data (excluding password)
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: "Login successful.",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Create user
export const create = async (req, res) => {
  try {
    const userData = new User(req.body);
    const { email } = userData;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    const savedUser = await userData.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Fetch all users
export const fetch = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "Users not found." });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Update user
export const update = async (req, res) => {
  try {
    const id = req.params.id;

    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.findByIdAndDelete(id);
    res.status(201).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};
