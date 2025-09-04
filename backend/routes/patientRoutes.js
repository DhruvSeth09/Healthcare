const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  getPatients,
  getPatient,
  addPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

// @route   GET /api/patients
// @desc    Get all patients for the authenticated user
// @access  Private
router.get('/', protect, getPatients);

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private
router.get('/:id', protect, getPatient);

// @route   POST /api/patients
// @desc    Add a new patient
// @access  Private
router.post(
  '/',
  protect,
  [
    body('name', 'Name is required').notEmpty(),
    body('age', 'Age is required').isNumeric(),
    body('gender', 'Gender is required').isIn(['Male', 'Female', 'Other']),
    body('contact', 'Contact is required').notEmpty(),
    body('address', 'Address is required').notEmpty(),
  ],
  addPatient
);

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', protect, updatePatient);

// @route   DELETE /api/patients/:id
// @desc    Delete patient
// @access  Private
router.delete('/:id', protect, deletePatient);

module.exports = router;
