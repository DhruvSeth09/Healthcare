const { validationResult } = require('express-validator');
const Mapping = require('../models/Mapping');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');


const getMappings = async (req, res) => {
  try {
    const mappings = await Mapping.find({}).populate('patient').populate('doctor');
    res.json(mappings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


const getMappingsByPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    if (patient.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const mappings = await Mapping.find({ patient: req.params.patientId }).populate('doctor');
    res.json(mappings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


const addMapping = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { patientId, doctorId } = req.body;

  try {
    
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    if (patient.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    
    const existingMapping = await Mapping.findOne({ patient: patientId, doctor: doctorId });
    if (existingMapping) {
      return res.status(400).json({ message: 'Mapping already exists' });
    }

    const mapping = new Mapping({
      patient: patientId,
      doctor: doctorId,
    });

    await mapping.save();
    res.status(201).json(mapping);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const deleteMapping = async (req, res) => {
  try {
    const mapping = await Mapping.findById(req.params.id).populate('patient');
    if (!mapping) {
      return res.status(404).json({ message: 'Mapping not found' });
    }

    
    if (mapping.patient.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Mapping.findByIdAndRemove(req.params.id);
    res.json({ message: 'Mapping removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getMappings,
  getMappingsByPatient,
  addMapping,
  deleteMapping,
};
