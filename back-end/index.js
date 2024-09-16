const { OAuth2Client } = require('google-auth-library');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
require('./modals/User');

const port = process.env.PORT || 3000;
const app = express();
const isAuthenticated = require('./controller/user').isAuthenticated;



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
    sameSite: 'none',  
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


app.get('/check-auth', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ user: req.session.userName });
  } else {
    res.status(401).json({ message: 'User not authenticated' });
  }
});

// Protected route (requires authentication)
app.get('/protected-route', isAuthenticated, (req, res) => {
  res.json({ message: `Welcome, ${req.session.username}!` });
  
  
});

// MongoDB Connection
mongoose.connect(mongoUri)
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => {
    console.log('Connection error:', err);
  });


app.listen(port, () => {
  console.log(`Backend is running on port: ${port}`);
});
