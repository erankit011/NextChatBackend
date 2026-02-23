const UserModel = require("../models/user.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../services/mail.service");

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });
};

// Helper function to set token cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // CSRF protection
    maxAge: 5 * 60 * 60 * 1000, // 5 hours in milliseconds
  });
};


const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields (username, email, password) are required",
      });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    const userResponse = await UserModel.findById(newUser._id).select("-password");

    const token = generateToken(newUser._id);
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      data: userResponse,
      token,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    const userResponse = await UserModel.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      data: userResponse,
      token,
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_RAW_SECRET,
      { expiresIn: "15m" }
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your password",
      html: `
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link will expire in 15 minutes.</p>
          <h3>Password Reset</h3>
      `
    }).catch(emailError => {
      console.error("Email sending failed:", emailError);
      throw new Error("Failed to send reset email. Please try again later.");
    });

    return res.json({
      success: true,
      message: "Password reset link sent to email",
    });

  } catch (error) {
    console.error("Forgot password error:", {
      message: error.message,
      code: error.code,
      email: req.body?.email,
    });

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process password reset request",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_RAW_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.findByIdAndUpdate(decoded.id, {
      password: hashedPassword
    });

    return res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
    }

    if (updateData.email) {
      const existingUser = await UserModel.findOne({
        email: updateData.email.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already in use",
        });
      }

      updateData.email = updateData.email.trim().toLowerCase();
    }

    if (updateData.username) {
      updateData.username = updateData.username.trim();
    }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password.trim(), 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logoutUser,
  updateUser,
};
