import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import generateToken from "../src/utils/generateToken.js";
import Notification from "../models/Notification.js";

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

/** Register Company */
export const registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file;
    if (!name || !email || !password || !image)
      return res.json({ success: false, message: "All fields required" });

    if (process.env.NODE_ENV === "production" && !getMailer()) {
      return res.status(500).json({
        success: false,
        message: "Email verification is not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in backend environment variables.",
      });
    }

    const existing = await Company.findOne({ email });
    if (existing) {
      if (existing.isVerified === false) {
        if (process.env.NODE_ENV === "production" && !getMailer()) {
          return res.status(500).json({
            success: false,
            message: "Email verification is not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in backend environment variables.",
          });
        }

        const otp = makeOtp();
        existing.emailOtpHash = hashOtp(email, otp);
        existing.emailOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
        await existing.save();

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

      return res.status(409).json({ success: false, message: "Company already exists" });
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

    let logo;
    try {
      logo = await cloudinary.uploader.upload(image.path);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Company logo upload failed. Please try a smaller image.",
      });
    }

    const otp = makeOtp();
    const company = await Company.create({
      name,
      email,
      password,
      image: logo.secure_url,
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

    res.status(201).json(response);
  } catch (error) {
    console.error("Company registration failed:", error?.message || error);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const verifyCompanyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP required" });

    const company = await Company.findOne({ email });
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });

    if (company.isVerified === true) {
      const token = generateToken(company._id);
      const companyData = company.toObject();
      delete companyData.password;
      return res.json({
        success: true,
        message: "Email already verified",
        companyData,
        company: companyData,
        token,
      });
    }

    if (!company.emailOtpHash || !company.emailOtpExpiresAt) {
      return res.status(400).json({ success: false, message: "OTP not generated. Please resend OTP." });
    }

    if (company.emailOtpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired. Please resend OTP." });
    }

    const incomingHash = hashOtp(email, String(otp).trim());
    if (incomingHash !== company.emailOtpHash) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    company.isVerified = true;
    company.emailOtpHash = "";
    company.emailOtpExpiresAt = null;
    await company.save();

    const token = generateToken(company._id);
    const companyData = company.toObject();
    delete companyData.password;
    res.json({
      success: true,
      message: "Email verified successfully",
      companyData,
      company: companyData,
      token,
    });
  } catch (error) {
    console.error("Verify company email error:", error);
    res.status(500).json({ success: false, message: "Email verification failed" });
  }
};

export const resendCompanyEmailOtp = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    if (process.env.NODE_ENV === "production" && !getMailer()) {
      return res.status(500).json({
        success: false,
        message: "Email verification is not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in backend environment variables.",
      });
    }

    const company = await Company.findOne({ email });
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    if (company.isVerified === true) return res.status(400).json({ success: false, message: "Email already verified" });

    const otp = makeOtp();
    company.emailOtpHash = hashOtp(email, otp);
    company.emailOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
    await company.save();

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
    console.error("Resend company OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to resend OTP" });
  }
};

/** Login Company */
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });

    if (company.isVerified === false) {
      return res.status(403).json({ success: false, message: "Please verify your email first" });
    }

    const match = await bcrypt.compare(password, company.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid password" });

    const token = generateToken(company._id);
    const companyData = company.toObject();
    delete companyData.password;
    res.json({
      success: true,
      message: "Login successful",
      companyData,
      company: companyData,
      token,
    });
  } catch {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};


export const fetchCompanyData = async (req, res) => {
  try {
    const company = req.companyData;
    res.status(200).json({ success: true, companyData: company });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user data" });
  }
};


export const postJob = async (req, res) => {
  try {
    const { title, description, location, level, salary, category } = req.body;

    // 🔹 Validate required fields
    if (!title || !description || !location || !level || !salary || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (title, description, location, level, salary, category).",
      });
    }

    // 🔹 Create job in database
    const job = await Job.create({
      title,
      description,
      location,
      level,
      salary,
      category,
      companyId: req.companyData._id, // from companyAuthMiddleware
      date: Date.now(),
      visible: true,
    });

    res.status(201).json({
      success: true,
      message: "Job posted successfully!",
      job,
    });
  } catch (error) {
    console.error("❌ Job Posting Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Job posting failed. Please try again.",
    });
  }
};

/** 5️⃣ Get all jobs posted by the logged-in company + applicant analytics */
export const getCompanyPostedAllJobs = async (req, res) => {
  try {
    const companyId = req.companyData._id; // from auth middleware

    // 🔹 Fetch all jobs for this company
    const jobs = await Job.find({ companyId }).select("title description salary location");

    if (!jobs.length) {
      return res.status(200).json({
        success: true,
        message: "No jobs found for this company.",
        jobs: [],
      });
    }
    console.log("jobs", jobs);
    
    // 🔹 Attach applicant count for each job
    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.countDocuments({ jobId: job._id });
        return {
          id:job._id,
          title: job.title,
          location: job.location,
          applicants,
        };
      })
    );

    res.status(200).json({
      success: true,
      jobs: jobsWithApplicants,
    });
  } catch (error) {
    console.error("❌ Error in getCompanyPostedAllJobs:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company jobs",
    });
  }
};


/** ✅ Close Job + Applications + Send Notifications */
export const closeJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    // ✅ 1. Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    // ✅ 2. Update all related applications to 'Close'
    const applications = await JobApplication.find({ jobId });

    if (!applications.length) {
      // Still close job even if no applicants
      job.status = "Close";
      await job.save();
      return res.json({
        success: true,
        message: "Job closed. No applicants to notify.",
      });
    }

    await JobApplication.updateMany({ jobId }, { $set: { status: "Close" } });

    // ✅ 3. Update the Job status to 'Close'
    job.status = "Close";
    await job.save();

    // ✅ 4. Send notifications to all applicants
    const notifications = applications.map((app) => ({
      userId: app.userId,
      title: "Job Closed",
      message: `The job "${job.title}" has been closed by the company.`,
      type: "Job",
    }));

    await Notification.insertMany(notifications);

    res.json({
      success: true,
      message: `Job and ${applications.length} application(s) closed successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to close job and notify applicants.",
      error: error.message,
    });
  }
};


/** Get Pending Applicants */
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const applicants = await JobApplication.find({
      companyId: req.companyData._id,
      status: "Pending", // ✅ filter by status
    })
      .populate("userId", "name image resume skills bio")
      .populate("jobId", "title location level category");

    res.json({ success: true, applicants });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch pending applicants" });
  }
};


/** Get Shortlisted or Accepted Applicants */
export const getShortliestedApplicants = async (req, res) => {
  try {
    const applicants = await JobApplication.find({
      companyId: req.companyData._id,
      status: { $in: ["Shortlisted", "Accepted"] }, // ✅ match either status
    })
      .populate("userId", "name image resume skills bio")
      .populate("jobId", "title location level category");

    res.json({ success: true, applicants });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch shortlisted or accepted applicants",
      error: error.message,
    });
  }
};



/** ✅ Change Applicant Status (Pending → Shortlisted → Accepted/Rejected) */
export const changeStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "Application ID and status are required.",
      });
    }

    const validStatuses = ["Pending", "Shortlisted", "Rejected", "Accepted", "Close"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const updated = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("userId", "name email")
      .populate("jobId", "title")
      .populate("companyId", "name email image");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Job application not found.",
      });
    }

    // 🔔 Create a notification for the user
    await Notification.create({
      userId: updated.userId._id,
      companyId: updated.companyId._id,
      title: `Application ${status}`,
      message: `Your application for "${updated.jobId.title}" has been marked as ${status}.`,
      type: "Application",
    });

    res.status(200).json({
      success: true,
      message: `Status updated to '${status}' and notification sent.`,
      updated,
    });
  } catch (error) {
    console.error("❌ Error changing applicant status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to change applicant status.",
    });
  }
};
