const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  getMappings,
  getMappingsByPatient,
  addMapping,
  deleteMapping,
} = require('../controllers/mappingController');


router.get('/', protect, getMappings);


router.get('/:patientId', protect, getMappingsByPatient);


router.post(
  '/',
  protect,
  [
    body('patientId', 'Patient ID is required').notEmpty(),
    body('doctorId', 'Doctor ID is required').notEmpty(),
  ],
  addMapping
);

router.delete('/:id', protect, deleteMapping);

module.exports = router;
