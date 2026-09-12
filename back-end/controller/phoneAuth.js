const bcrypt = require('bcrypt');
const UserModel = require('../modals/User');
const twilioConfig = require('../config/twilio');

const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || !PHONE_REGEX.test(phone)) {
      return res.status(400).json({ message: 'A valid phone number in E.164 format is required (e.g. +919876543210)' });
    }

    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: 'This phone number is already registered' });
    }

    await twilioConfig.client().verify.v2
      .services(twilioConfig.verifyServiceSid())
      .verifications.create({ to: phone, channel: 'sms' });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Phone OTP send error:', err.message);
    res.status(500).json({ message: 'Failed to send OTP. Please check the phone number and try again.' });
  }
};

const signup = async (req, res) => {
  try {
    const { name, phone, password, otp } = req.body;
    if (!name || !phone || !password || !otp) {
      return res.status(400).json({ message: 'Name, phone number, password and OTP are required' });
    }
    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({ message: 'A valid phone number in E.164 format is required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: 'This phone number is already registered' });
    }

    const check = await twilioConfig.client().verify.v2
      .services(twilioConfig.verifyServiceSid())
      .verificationChecks.create({ to: phone, code: otp });

    if (check.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      phone,
      password: hashedPassword,
      isPhoneVerified: true,
    });
    await user.save();

    res.status(200).json({ code: 200, message: 'Signup successful' });
  } catch (err) {
    console.error('Phone signup error:', err.message);
    res.status(500).json({ message: 'Signup failed. Please try again.' });
  }
};

module.exports = { sendOtp, signup };
