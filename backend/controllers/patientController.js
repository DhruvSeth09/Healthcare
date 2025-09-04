const { validationResult } = require('express-validator');
const Patient = require('../models/Patient');


const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ user: req.user._id });
    res.json(patients);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    
    if (patient.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(patient);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


const addPatient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, age, gender, contact, address, medicalHistory } = req.body;

  try {
    const patient = new Patient({
      name,
      age,
      gender,
      contact,
      address,
      medicalHistory,
      user: req.user._id,
    });

    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const updatePatient = async (req, res) => {
  try {
    let patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    
    if (patient.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(patient);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    
    if (patient.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Patient.findByIdAndRemove(req.params.id);
    res.json({ message: 'Patient removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getPatients,
  getPatient,
  addPatient,
  updatePatient,
  deletePatient,
};
