const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getDoctors,
  getDoctor,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');


router.get('/', getDoctors);


router.get('/:id', getDoctor);


router.post(
  '/',
  [
    body('name', 'Name is required').notEmpty(),
    body('specialization', 'Specialization is required').notEmpty(),
    body('contact', 'Contact is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
  ],
  addDoctor
);


router.put('/:id', updateDoctor);

router.delete('/:id', deleteDoctor);

module.exports = router;
