const { OAuth2Client } = require('google-auth-library');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
  // Some local Windows setups can't resolve mongodb+srv SRV/TXT records via
  // the default resolver even though the OS itself can; point Node's
  // resolver at a public DNS server for local dev only.
  require('dns').setServers(['8.8.8.8', '1.1.1.1']);
}

require('./modals/User');

const port = process.env.PORT || 3000;
const app = express();
const isAuthenticated = require('./controller/user').isAuthenticated;
const isTeacher = require('./controller/teacher').isTeacher;


app.set('trust proxy', 1);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
// CORS setup
const corsOptions = {
  origin: process.env.FRONT_END,  // Frontend URL
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true,  
  allowedHeaders: [
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Content-Type',
    'Date',
    'X-Api-Version',
    'Authorization'
  ]
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  next();
});


const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;  
app.use(session({
  secret: process.env.SESSION_SECRET,  
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUri,  // MongoDB connection URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,  // 1 day session expiration
    secure: process.env.NODE_ENV === 'production',  
    httpOnly: true,  
    sameSite: 'None',  
  },
}));

// Body parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Test route to check backend
app.get('/', (req, res) => {
  res.send(`Backend is running on port ${port}`);
});

// API routes
app.post('/signup', require('./controller/user').signup);
app.post('/gsignup', require('./controller/user').gsignup);
app.post('/signin', require('./controller/user').signin);
app.post('/gsignin', require('./controller/user').gsignin);  // Ensure Google OAuth works properly
app.post('/sendotp', require('./controller/user').sendotp);
app.post('/submitotp', require('./controller/user').submitotp);
app.post('/logout',require('./controller/user').logout);

// Phone number signup (SMS OTP verification via Twilio Verify)
app.post('/phone/send-otp', require('./controller/phoneAuth').sendOtp);
app.post('/phone/signup', require('./controller/phoneAuth').signup);


app.get('/check-session', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ user: req.session.userName });
  } else {
    res.status(401).json({ message: 'User not authenticated' });
  }
});
// Protected route (requires authentication)
app.get('/check-auth', isAuthenticated, (req, res) => {
  res.json({ message: `Welcome, ${req.userEmail || req.userPhone}!` });
});

// Code playground execution (proxies to Judge0, keeps the RapidAPI key server-side)
app.post('/execute', isAuthenticated, require('./controller/playground').execute);

// Teacher portal auth (separate from student signup/signin; requires an invite code)
app.post('/teacher/signup', require('./controller/teacher').signup);
app.post('/teacher/signin', require('./controller/teacher').signin);

// Course / Subject / Slide content -- readable by any signed-in user,
// mutable only by teachers.
const courses = require('./controller/courses');
const subjects = require('./controller/subjects');
const slides = require('./controller/slides');

app.get('/courses', isAuthenticated, courses.list);
app.post('/courses', isAuthenticated, isTeacher, courses.create);
app.put('/courses/:id', isAuthenticated, isTeacher, courses.update);
app.delete('/courses/:id', isAuthenticated, isTeacher, courses.remove);

app.get('/courses/:courseKey/subjects', isAuthenticated, subjects.listByCourseAndSemester);
app.post('/subjects', isAuthenticated, isTeacher, subjects.create);
app.put('/subjects/:id', isAuthenticated, isTeacher, subjects.update);
app.delete('/subjects/:id', isAuthenticated, isTeacher, subjects.remove);

app.get('/subjects/:subjectId/slides', isAuthenticated, slides.listBySubject);
app.post('/slides/upload-signature', isAuthenticated, isTeacher, slides.getUploadSignature);
app.post('/slides', isAuthenticated, isTeacher, slides.create);
app.delete('/slides/:id', isAuthenticated, isTeacher, slides.remove);

// Blog posts -- readable by any signed-in user, mutable only by teachers.
const blogs = require('./controller/blogs');

app.get('/blogs', isAuthenticated, blogs.list);
app.get('/blogs/:slug', isAuthenticated, blogs.getBySlug);
app.post('/blogs', isAuthenticated, isTeacher, blogs.create);
app.put('/blogs/:id', isAuthenticated, isTeacher, blogs.update);
app.delete('/blogs/:id', isAuthenticated, isTeacher, blogs.remove);

// MongoDB Connection
mongoose.connect(mongoUri)
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.log('Connection error:', err);
  });


if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend is running on port: ${port}`);
  });
}

module.exports = app;
