const mongoose = require('mongoose');

const MappingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  assignedDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });


MappingSchema.index({ patient: 1, doctor: 1 }, { unique: true });

module.exports = mongoose.model('Mapping', MappingSchema);
