const { validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


const addDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, specialization, contact, email } = req.body;

  try {
    let doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    doctor = new Doctor({
      name,
      specialization,
      contact,
      email,
    });

    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const updateDoctor = async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(doctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await Doctor.findByIdAndRemove(req.params.id);
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getDoctors,
  getDoctor,
  addDoctor,
  updateDoctor,
  deleteDoctor,
};
