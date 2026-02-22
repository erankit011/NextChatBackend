const express = require("express");
const router = express.Router();

const {
  createUser,
  deleteUser,
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  resetPassword,
  updateUser,
} = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth.middleware");

const {
  validateUserCreate,
  validateUserUpdate,
  validateObjectId,
} = require("../middleware/validation.middleware");

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/me", authMiddleware, getCurrentUser);
router.post("/", validateUserCreate, createUser);

router.put("/:id", validateObjectId, validateUserUpdate, updateUser);
router.delete("/:id", validateObjectId, deleteUser);

module.exports = router;
