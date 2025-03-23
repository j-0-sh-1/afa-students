const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files go in uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

// Get all students (with optional search)
router.get('/', auth, async (req, res) => {
  const { search } = req.query;
  const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  try {
    const students = await Student.find(query).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single student by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new student (admin only)
router.post('/', [auth, admin, upload.fields([
  { name: 'applicationForm', maxCount: 1 },
  { name: 'recommendationLetter', maxCount: 1 },
  { name: 'personalStatement', maxCount: 1 },
])], async (req, res) => {
  const { name, customUserId, password, paymentDetails, courses } = req.body;
  const files = req.files;

  try {
    // Hash the student's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create student object
    const student = new Student({
      name,
      customUserId,
      password: hashedPassword,
      paymentDetails: JSON.parse(paymentDetails),
      documents: {
        applicationForm: files.applicationForm ? files.applicationForm[0].path : null,
        recommendationLetter: files.recommendationLetter ? files.recommendationLetter[0].path : null,
        personalStatement: files.personalStatement ? files.personalStatement[0].path : null,
      },
      courses: JSON.parse(courses),
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course progress (admin only)
router.put('/:id/progress', [auth, admin], async (req, res) => {
  const { courseId, progress } = req.body;
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const course = student.courses.id(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.progress.push(progress);
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;