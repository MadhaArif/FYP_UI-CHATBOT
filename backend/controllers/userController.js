import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import generateToken from "../src/utils/generateToken.js";

const OTP_TTL_MS = 10 * 60 * 1000;

const getMailer = () => {
  const smtpUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const oauthClientId = process.env.GMAIL_OAUTH_CLIENT_ID || process.env.SMTP_OAUTH_CLIENT_ID;
  const oauthClientSecret = process.env.GMAIL_OAUTH_CLIENT_SECRET || process.env.SMTP_OAUTH_CLIENT_SECRET;
  const oauthRefreshToken = process.env.GMAIL_OAUTH_REFRESH_TOKEN || process.env.SMTP_OAUTH_REFRESH_TOKEN;

  if (!smtpUser) return null;

  const smtpHost = process.env.SMTP_HOST;
  if (smtpHost) {
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpSecure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: oauthClientId && oauthClientSecret && oauthRefreshToken
        ? {
            type: "OAuth2",
            user: smtpUser,
            clientId: oauthClientId,
            clientSecret: oauthClientSecret,
            refreshToken: oauthRefreshToken,
          }
        : smtpPass
          ? { user: smtpUser, pass: smtpPass }
          : undefined,
    });
  }

  const service = process.env.SMTP_SERVICE || "gmail";
  if (oauthClientId && oauthClientSecret && oauthRefreshToken) {
    return nodemailer.createTransport({
      service,
      auth: {
        type: "OAuth2",
        user: smtpUser,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret,
        refreshToken: oauthRefreshToken,
      },
    });
  }

  if (smtpPass) {
    return nodemailer.createTransport({ service, auth: { user: smtpUser, pass: smtpPass } });
  }

  return null;
};

const makeOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const hashOtp = (email, otp) => {
  const secret = process.env.OTP_SECRET || process.env.JWT_SECRET || "otp";
  return crypto.createHash("sha256").update(`${email}:${otp}:${secret}`).digest("hex");
};

const sendOtpEmail = async ({ to, otp }) => {
  try {
    const transporter = getMailer();
    if (!transporter) return { sent: false, reason: "not_configured" };

    const from = process.env.SMTP_FROM || process.env.GMAIL_USER || process.env.SMTP_USER;
    await transporter.verify();
    const info = await transporter.sendMail({
      from,
      to,
      subject: "CampusConnect Email Verification OTP",
      text: `Your CampusConnect verification OTP is: ${otp}\n\nThis code expires in 10 minutes.`,
    });
    return { sent: true, messageId: info?.messageId };
  } catch (err) {
    return { sent: false, reason: "send_failed", error: err?.message || String(err) };
  }
};

/** -------------------------------
 *  REGISTER USER (Talent Seeker)
 *  ------------------------------- */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, skills, bio } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (process.env.NODE_ENV === "production" && !getMailer()) {
      return res.status(500).json({
        success: false,
        message: "Email verification is not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in backend environment variables.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified === false) {
        if (process.env.NODE_ENV === "production" && !getMailer()) {
          return res.status(500).json({
            success: false,
            message: "Email verification is not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in backend environment variables.",
          });
        }

        const otp = makeOtp();
        existingUser.emailOtpHash = hashOtp(email, otp);
        existingUser.emailOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
        await existingUser.save();

        const emailResult = await sendOtpEmail({ to: email, otp });
        if (!emailResult.sent) {
          console.error("Email OTP send failed:", emailResult.reason, emailResult.error || "");
        }
        const response = {
          success: true,
          message:
            emailResult.sent
              ? "OTP resent to your email. Please verify to complete registration."
              : "Account already exists but email OTP could not be sent. Please configure email or try again later.",
          requiresVerification: true,
          email,
        };

        if (!emailResult.sent && process.env.NODE_ENV !== "production") {
          response.devOtp = otp;
          if (emailResult.error) response.devEmailError = emailResult.error;
        }

        return res.status(200).json(response);
      }

      return res.json({ success: false, message: "User already exists" });
    }

    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (!hasCloudinary) {
      return res.status(500).json({
        success: false,
        message:
          "Image upload is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the backend environment variables.",
      });
    }

    let imageUpload;
    try {
      imageUpload = await cloudinary.uploader.upload(imageFile.path);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Profile image upload failed. Please try a smaller image.",
      });
    }

    // ⚠️ Don’t hash password here, let model pre-save do it
    const otp = makeOtp();
    const user = await User.create({
      name,
      email,
      password, // plain password
      image: imageUpload.secure_url,
      skills: skills ? skills.split(",") : [],
      bio: bio || "",
      isVerified: false,
      emailOtpHash: hashOtp(email, otp),
      emailOtpExpiresAt: new Date(Date.now() + OTP_TTL_MS),
    });

    const emailResult = await sendOtpEmail({ to: email, otp });
    if (!emailResult.sent) {
      console.error("Email OTP send failed:", emailResult.reason, emailResult.error || "");
    }
    const response = {
      success: true,
      message:
        emailResult.sent
          ? "OTP sent to your email. Please verify to complete registration."
          : "Account created but email OTP could not be sent. Please configure email or try resend OTP.",
      requiresVerification: true,
      email,
    };

    if (!emailResult.sent && process.env.NODE_ENV !== "production") {
      response.devOtp = otp;
      if (emailResult.error) response.devEmailError = emailResult.error;
    }

    res.json(response);
  } catch (error) {
    console.error("User registration failed:", error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const verifyUserEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.isVerified === true) {
      const token = generateToken(user._id);
      const userData = user.toObject();
      delete userData.password;
      return res.json({ success: true, message: "Email already verified", userData, token });
    }

    if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
      return res.status(400).json({ success: false, message: "OTP not generated. Please resend OTP." });
    }

    if (user.emailOtpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired. Please resend OTP." });
    }

    const incomingHash = hashOtp(email, String(otp).trim());
    if (incomingHash !== user.emailOtpHash) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.emailOtpHash = "";
    user.emailOtpExpiresAt = null;
    await user.save();

    const token = generateToken(user._id);
    const userData = user.toObject();
    delete userData.password;
    res.json({ success: true, message: "Email verified successfully", userData, token });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ success: false, message: "Email verification failed" });
  }
};

export const resendUserEmailOtp = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    if (process.env.NODE_ENV === "production" && !getMailer()) {
      return res.status(500).json({
        success: false,
        message: "Email verification is not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in backend environment variables.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified === true) return res.status(400).json({ success: false, message: "Email already verified" });

    const otp = makeOtp();
    user.emailOtpHash = hashOtp(email, otp);
    user.emailOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
    await user.save();

    const emailResult = await sendOtpEmail({ to: email, otp });
    if (!emailResult.sent) {
      console.error("Email OTP send failed:", emailResult.reason, emailResult.error || "");
    }
    const response = {
      success: true,
      message: emailResult.sent ? "OTP resent to your email" : "Email OTP could not be sent. Please configure email or try again later.",
    };

    if (!emailResult.sent && process.env.NODE_ENV !== "production") {
      response.devOtp = otp;
      if (emailResult.error) response.devEmailError = emailResult.error;
    }

    res.json(response);
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to resend OTP" });
  }
};


/** -------------------------------
 *  LOGIN USER
 *  ------------------------------- */
export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.isVerified === false) {
      return res.status(403).json({ success: false, message: "Please verify your email first" });
    }
   

    const match = await bcrypt.compare(password, user.password);
 

    if (!match)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id);
    const userData = user.toObject();
    delete userData.password;
    res.json({ success: true, message: "Login successful", userData, token });

  } catch (error) {
    console.error("🔴 Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

/** -------------------------------
 *  FETCH USER PROFILE DATA
 *  ------------------------------- */
export const fetchUserData = async (req, res) => {
  try {
    const user = req.userData;
    res.status(200).json({ success: true, userData: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user data" });
  }
};

/** -------------------------------
 *  APPLY FOR A JOB
 *  ------------------------------- */
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userData._id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const isApplied = await JobApplication.findOne({ userId, jobId });
    if (isApplied)
      return res.status(409).json({ success: false, message: "Already applied to this job" });

    const matchScore = calculateMatchScore(req.userData.skills, job.category);

    const application = await JobApplication.create({
      userId,
      companyId: job.companyId,
      jobId,
      status: "Pending",
      date: Date.now(),
      matchScore,
    });

    // Update analytics on Job
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    res.status(201).json({ success: true, message: "Job applied successfully", application });
  } catch (error) {
    console.error("Job application error:", error);
    res.status(500).json({ success: false, message: "Application failed" });
  }
};

// Simple AI-like match scoring based on skill/category keywords
function calculateMatchScore(userSkills = [], jobCategory = "") {
  const normalized = jobCategory.toLowerCase();
  const matched = userSkills.filter((s) => normalized.includes(s.toLowerCase()));
  return Math.min(100, matched.length * 20);
}

/** -------------------------------
 *  GET USER JOB APPLICATIONS
 *  ------------------------------- */
export const getUserAppliedJobs = async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.userData._id })
      .populate("companyId", "name email image")
      .populate("jobId", "title location category level salary");

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

/** -------------------------------
 *  UPLOAD RESUME
 *  ------------------------------- */
export const uploadResume = async (req, res) => {
  try {
    const userId = req.userData._id;
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "Resume file required" });

    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (!hasCloudinary) {
      return res.status(500).json({
        success: false,
        message:
          "File upload is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the backend environment variables.",
      });
    }

    const uploaded = await cloudinary.uploader.upload(file.path);
    const user = await User.findByIdAndUpdate(userId, { resume: uploaded.secure_url }, { new: true });

    res.json({ success: true, message: "Resume uploaded", resumeUrl: user.resume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users except passwords
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    if (!users.length) {
      return res.status(200).json({
        success: true,
        message: "No users found in the system.",
        users: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "All registered users fetched successfully.",
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};
