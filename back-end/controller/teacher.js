const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserModel = require('../modals/User');
const TeacherInvite = require('../modals/TeacherInvite');

const INVITE_CODE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const sendInviteCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + INVITE_CODE_TTL_MS);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: `"ACAD Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your ACAD teacher invite code',
      text: `Your teacher signup invite code is: ${code}\n\nThis code expires in 15 minutes. If you did not request this, you can safely ignore this email.`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your ACAD teacher invite code</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333;">
            <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; padding: 10px;">
                    <img src="https://res.cloudinary.com/dta4cujnn/image/upload/v1626255557/logo_qaexch.png" alt="ACAD Logo" style="max-width: 150px;">
                </div>
                <div style="padding: 20px; text-align: center;">
                    <h1>Teacher Signup</h1>
                    <p>Use the invite code below to finish creating your teacher account:</p>
                    <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">${code}</p>
                    <p>This code expires in 15 minutes.</p>
                </div>
                <div style="text-align: center; padding: 10px; font-size: 12px; color: #888;">
                    <p>&copy; 2022 ACAD. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    if (!info.messageId) {
      return res.status(500).json({ message: 'Failed to send invite code' });
    }

    await TeacherInvite.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase(), code, expiresAt },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Invite code sent to your email' });
  } catch (err) {
    console.error('Teacher invite code error:', err.message);
    res.status(500).json({ message: 'Failed to send invite code' });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    if (!name || !email || !password || !inviteCode) {
      return res.status(400).json({ message: 'Name, email, password and invite code are required' });
    }

    const invite = await TeacherInvite.findOne({ email: email.toLowerCase() });
    if (!invite || invite.code !== inviteCode || invite.expiresAt < new Date()) {
      return res.status(403).json({ message: 'Invalid or expired invite code' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: 'teacher',
    });
    await teacher.save();
    await invite.deleteOne();

    res.status(200).json({ message: 'Teacher account created. You can now sign in.' });
  } catch (err) {
    console.error('Teacher signup error:', err.message);
    res.status(500).json({ message: 'Signup failed' });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email, role: 'teacher' });
    if (!user) {
      return res.status(404).json({ message: 'Teacher account not found' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'teacher' },
      process.env.SECRET_KEY,
      { expiresIn: '4h' }
    );

    res.status(200).json({ name: user.name, token });
  } catch (err) {
    console.error('Teacher signin error:', err.message);
    res.status(500).json({ message: 'Signin failed' });
  }
};

// Runs after isAuthenticated; confirms the authenticated user currently holds
// the teacher role (looked up fresh, not trusted from the token, so a role
// change or account removal takes effect immediately rather than waiting
// for the token to expire).
const isTeacher = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user || user.role !== 'teacher') {
      return res.status(403).json({ message: 'Teacher access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Authorization check failed' });
  }
};

module.exports = { sendInviteCode, signup, signin, isTeacher };
