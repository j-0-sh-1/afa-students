const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  customUserId: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  paymentDetails: {
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
  },
  documents: {
    applicationForm: { type: String }, // File path
    recommendationLetter: { type: String },
    personalStatement: { type: String },
  },
  courses: [
    {
      semester: { type: Number, required: true },
      courseName: { type: String, required: true },
      progress: [
        {
          week: { type: Number, required: true },
          status: { type: String, required: true }, // e.g., "50%" or "A"
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Student', studentSchema);
