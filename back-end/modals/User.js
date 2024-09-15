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
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
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
  }
});

module.exports = mongoose.model('User', userSchema);
