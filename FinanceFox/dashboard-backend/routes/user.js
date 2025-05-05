import { Router } from "express";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = Router();

router.get("/verify", async (req, res) => {
  const token = req.headers["authorization"].split(" ").pop();
  if (!token) {
    return res.json({ success: false, errors: ["Not Authorized"] });
  }

  const data = jwt.verify(token, process.env.JWT_SECRET);
  const resp = await User.findOne({ email: data.email });
  delete resp.password;
  res.json({ success: true, data: { email: resp.email, _id: resp._id } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, errors: ["Bad Request"] });
  } else {
    try {
      const resp = await User.findOne({ email });
      if (!resp || !(await resp.comparePassword(password))) {
        return res.json({ success: false, errors: ["User Detail Mismatch"] });
      }
      const token = jwt.sign({ _id: resp._id, email }, process.env.JWT_SECRET);
      return res.json({ success: true, errors: [], data: { token } });
    } catch {
      return res.json({ success: false, errors: ["Server Error"] });
    }
  }
});

router.post("/register/pre", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, errors: ["Bad Request"] });
  } else {
    try {
      const resp = await User.findOne({ email }).countDocuments();
      if (resp) {
        return res.json({ success: false, errors: ["Duplicate entry found"] });
      }
      return res.json({ success: true, errors: [] });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, errors: ["Server Error"] });
    }
  }
});

router.post("/register/otp", async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "Registration OTP",
    text: otp,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.json({ success: false, errors: ["Failed to send OTP"] });
    }
    return res.json({ success: true, errors: [], data: { otp } });
  });
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, errors: ["Bad Request"] });
  } else {
    try {
      const user = new User({ email, password });
      await user.save();
      const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET);
      res.json({ data: { token }, errors: [], success: true });
    } catch {
      return res.json({ success: false, errors: ["Server Error"] });
    }
  }
});

export default router;
