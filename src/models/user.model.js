const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const twoFactor = require('node-2fa');

const { CODE_VERIFY_2FA_SUCCESS } = require('../constants');

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    normalizedEmail: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      default: '2000-01-01',
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'male',
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    verifyExpireAt: {
      type: Date,
    },
    forgotStatus: {
      type: String,
      enum: [null, 'verifyOTP', 'verified'],
      default: null,
    },
    isLocked: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: ['admin', 'shop', 'user'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: 'https://hitly.vn/avatar-default',
    },
    background: {
      type: String,
      default: 'https://hitly.vn/background-default',
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    is2FA: {
      type: Boolean,
      default: false,
    },
    secret: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.isEmailTaken = async function (normalizedEmail, excludeUserId) {
  const user = await this.findOne({ normalizedEmail, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if (!user.secret) {
    const { secret } = twoFactor.generateSecret();
    user.secret = secret;
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.methods.is2FAMatch = async function (code) {
  const user = this;
  const result = twoFactor.verifyToken(user.secret, code);
  if (!result) return false;
  return CODE_VERIFY_2FA_SUCCESS.includes(result.delta);
};

module.exports = mongoose.model('User', userSchema);
