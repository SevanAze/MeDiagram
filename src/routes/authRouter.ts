import express from "express";
import {
  registerUser,
  authenticateUser,
  logoutUser,
  verifyToken,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authenticateUser);
router.post("/logout", logoutUser);
router.post("/token", verifyToken);

export default router;