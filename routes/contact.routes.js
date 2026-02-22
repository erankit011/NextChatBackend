const express = require("express");
const router = express.Router();

const { sendContactMessage } = require("../controllers/contact.controller");
const { validateContactRequest } = require("../middleware/validation.middleware");

// POST /api/contact - Send contact support message
router.post("/", validateContactRequest, sendContactMessage);

module.exports = router;
