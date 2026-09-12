const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        // Only validate when actually set -- email is optional for
        // phone-based accounts.
        return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        // E.164 format, e.g. +919876543210
        return !v || /^\+[1-9]\d{7,14}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number (use E.164 format, e.g. +919876543210)!`
    }
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  otp: {
    type: Number
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  }
});

userSchema.pre('validate', function(next) {
  if (!this.email && !this.phone && !this.googleId) {
    return next(new Error('An account needs an email, phone number, or Google sign-in.'));
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
