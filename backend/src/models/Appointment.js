import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      name: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        index: true,
      },
      age: Number,
      gender: String,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    visitDetails: {
      height: String,
      weight: String,
      temperature: String,
      pulse: String,
      prescription: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for checking slot availability
appointmentSchema.index({ date: 1, timeSlot: 1 });

export default mongoose.model('Appointment', appointmentSchema);
