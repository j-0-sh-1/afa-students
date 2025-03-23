const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'faculty'], required: true },
}, { collection: 'users' });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log('Comparing password:', candidatePassword);
  console.log('Stored hash:', this.password);
  const trimmedCandidate = candidatePassword.trim();
  const trimmedHash = this.password.trim();
  console.log('Trimmed candidate:', trimmedCandidate);
  console.log('Trimmed hash:', trimmedHash);
  const isMatch = await bcrypt.compare(trimmedCandidate, trimmedHash);
  console.log('bcrypt.compare result:', isMatch);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema);