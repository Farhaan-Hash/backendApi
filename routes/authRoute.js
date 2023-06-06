import express from "express";
import {
  registerUser,
  loginUser,
  userData,
  updateUser,
  verifyMail,
} from "../controller/authController.js";
import verifyToken from "../config/authMiddleware.js";

const router = express.Router();

// Register Route
router.post("/register", registerUser);
// Login Route
router.post("/login", loginUser);
// JWT VERIFY
router.get("/userdata", verifyToken, userData); //passing token to userData variable 2 functions\
// password update
router.post("/update", updateUser);
// After verification
router.post("/verify-mail", verifyMail);

export default router;
