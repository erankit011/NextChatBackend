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




/**
 * Sanitize input to prevent XSS attacks
 * Removes or escapes HTML tags and script elements
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  
  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");
  
  // Escape special HTML characters
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
  
  return sanitized;
};

/**
 * Middleware to validate contact request data (POST /api/contact)
 * Validates: name, email, message
 * Trims whitespace and sanitizes input to prevent XSS attacks
 */
const validateContactRequest = (req, res, next) => {
  const errors = [];

  // Trim whitespace from all string fields
  if (req.body.name) {
    req.body.name = req.body.name.trim();
  }
  if (req.body.email) {
    req.body.email = req.body.email.trim().toLowerCase();
  }
  if (req.body.message) {
    req.body.message = req.body.message.trim();
  }

  // Validate name
  if (!req.body.name) {
    errors.push("Name is required");
  } else if (req.body.name.length === 0) {
    errors.push("Name cannot be empty");
  } else if (req.body.name.length > 100) {
    errors.push("Name must not exceed 100 characters");
  }

  // Validate email
  if (!req.body.email) {
    errors.push("Email is required");
  } else if (!emailRegex.test(req.body.email)) {
    errors.push("Please enter a valid email address");
  }

  // Validate message
  if (!req.body.message) {
    errors.push("Message is required");
  } else if (req.body.message.length === 0) {
    errors.push("Message cannot be empty");
  } else if (req.body.message.length < 10) {
    errors.push("Message must be at least 10 characters long");
  } else if (req.body.message.length > 2000) {
    errors.push("Message must not exceed 2000 characters");
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.length === 1 ? errors[0] : errors.join(", "),
      details: errors,
    });
  }

  // Sanitize inputs to prevent XSS attacks
  req.body.name = sanitizeInput(req.body.name);
  req.body.email = sanitizeInput(req.body.email);
  req.body.message = sanitizeInput(req.body.message);

  next();
};

module.exports = {
  validateUserCreate,
  validateUserUpdate,
  validateObjectId,
  validateContactRequest,
};
