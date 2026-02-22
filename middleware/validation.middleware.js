const mongoose = require("mongoose");

/**
 * Email validation regex - matches the pattern used in User model
 */
const emailRegex = /^(?:[a-zA-Z0-9_'^&+/=?`{|}~-]+(?:\.[a-zA-Z0-9_'^&+/=?`{|}~-]+)*)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

/**
 * Middleware to validate user creation data (POST /users)
 * Validates: username, email, password
 * Trims whitespace and normalizes email to lowercase
 */
const validateUserCreate = (req, res, next) => {
  const errors = [];

  // Trim whitespace from all string fields
  if (req.body.username) {
    req.body.username = req.body.username.trim();
  }
  if (req.body.email) {
    req.body.email = req.body.email.trim().toLowerCase();
  }
  if (req.body.password && typeof req.body.password === "string") {
    req.body.password = req.body.password.trim();
  }

  // Validate username
  if (!req.body.username) {
    errors.push("Username is required");
  } else if (req.body.username.length === 0) {
    errors.push("Username cannot be empty");
  }

  // Validate email
  if (!req.body.email) {
    errors.push("Email is required");
  } else if (!emailRegex.test(req.body.email)) {
    errors.push("Please enter a valid email address");
  }

  // Validate password
  if (!req.body.password) {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.length === 1 ? errors[0] : errors.join(", "),
      details: errors,
    });
  }

  next();
};

/**
 * Middleware to validate user update data (PUT /users/:id)
 * Validates: username, email, password (if provided)
 * Trims whitespace and normalizes email to lowercase
 */
const validateUserUpdate = (req, res, next) => {
  const errors = [];

  // Trim whitespace from all string fields
  if (req.body.username) {
    req.body.username = req.body.username.trim();
  }
  if (req.body.email) {
    req.body.email = req.body.email.trim().toLowerCase();
  }
  if (req.body.password && typeof req.body.password === "string") {
    req.body.password = req.body.password.trim();
  }

  // Validate username if provided
  if (req.body.username !== undefined) {
    if (!req.body.username || req.body.username.length === 0) {
      errors.push("Username cannot be empty");
    }
  }

  // Validate email if provided
  if (req.body.email !== undefined) {
    if (!req.body.email) {
      errors.push("Email cannot be empty");
    } else if (!emailRegex.test(req.body.email)) {
      errors.push("Please enter a valid email address");
    }
  }

  // Validate password if provided
  if (req.body.password !== undefined) {
    if (!req.body.password) {
      errors.push("Password cannot be empty");
    } else if (req.body.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.length === 1 ? errors[0] : errors.join(", "),
      details: errors,
    });
  }

  next();
};

/**
 * Middleware to validate MongoDB ObjectId format
 * Used for route parameters like :id
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid user ID format",
    });
  }

  next();
};

module.exports = {
  validateUserCreate,
  validateUserUpdate,
  validateObjectId,
};
