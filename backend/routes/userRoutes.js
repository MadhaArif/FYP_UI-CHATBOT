import express from "express";
import upload from "../src/utils/upload.js";
import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";
import {
  registerUser,
  loginUser,
  verifyUserEmailOtp,
  resendUserEmailOtp,
  fetchUserData,
  applyJob,
  getUserAppliedJobs,
  uploadResume,
  getAllUsers 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register-user", upload.single("image"), registerUser);
router.post("/verify-email", verifyUserEmailOtp);
router.post("/resend-otp", resendUserEmailOtp);
router.post("/login-user", loginUser);
router.get("/user-data", userAuthMiddleware, fetchUserData);
router.post("/apply-job", userAuthMiddleware, applyJob);
router.get("/all-users", getAllUsers);

router.get("/user-applications", userAuthMiddleware, getUserAppliedJobs);
router.post("/upload-resume", userAuthMiddleware, upload.single("resume"), uploadResume);

export default router;
