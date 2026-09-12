const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../modals/User');

const signup = async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (!process.env.TEACHER_INVITE_CODE || inviteCode !== process.env.TEACHER_INVITE_CODE) {
      return res.status(403).json({ message: 'Invalid invite code' });
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

module.exports = { signup, signin, isTeacher };
