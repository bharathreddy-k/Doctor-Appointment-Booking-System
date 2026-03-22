import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import { connectDB } from '../config/database.js';

// Define available time slots
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

export const getAvailableSlots = async (req, res) => {
  try {
    await connectDB();
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const appointmentDate = new Date(`${date}T00:00:00.000Z`);
    const startOfDay = new Date(appointmentDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const bookedSlots = bookedAppointments.map((apt) => apt.timeSlot);
    const availableSlots = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));

    res.json({
      date,
      availableSlots,
      bookedSlots,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    await connectDB();
    const { patientName, phoneNumber, age, gender, date, timeSlot } = req.body;

    // Validation
    if (!patientName || !phoneNumber || !age || !gender || !date || !timeSlot) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if slot is already booked
    const appointmentDate = new Date(`${date}T00:00:00.000Z`);
    const startOfDay = new Date(appointmentDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create or update patient
    let patient = await Patient.findOne({ phoneNumber });

    if (!patient) {
      patient = new Patient({
        name: patientName,
        phoneNumber,
        age,
        gender,
      });
      await patient.save();
    } else {
      // Update patient info if found (in case details changed)
      patient.name = patientName;
      patient.age = age;
      patient.gender = gender;
      await patient.save();
    }

    // Create appointment
    const appointment = new Appointment({
      patient: {
        name: patientName,
        phoneNumber,
        age,
        gender,
      },
      date: appointmentDate,
      timeSlot,
    });

    await appointment.save();

    // Add appointment to patient's visit history
    patient.visits.push(appointment._id);
    await patient.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    await connectDB();
    const appointments = await Appointment.find().sort({ date: 1, timeSlot: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Get previous visits for this patient
    const previousVisits = await Appointment.find({
      'patient.phoneNumber': appointment.patient.phoneNumber,
      _id: { $ne: id },
      'visitDetails.prescription': { $exists: true, $ne: null },
    }).sort({ date: -1 });

    res.json({
      appointment,
      previousVisits: previousVisits.map((visit) => ({
        date: visit.date,
        timeSlot: visit.timeSlot,
        prescription: visit.visitDetails?.prescription,
        details: visit.visitDetails,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentDetails = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { height, weight, temperature, pulse, prescription } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        visitDetails: {
          height,
          weight,
          temperature,
          pulse,
          prescription,
        },
        isCompleted: true,
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      message: 'Appointment details updated successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientHistory = async (req, res) => {
  try {
    await connectDB();
    const { phoneNumber } = req.params;

    const appointments = await Appointment.find({
      'patient.phoneNumber': phoneNumber,
    }).sort({ date: -1 });

    res.json({
      phoneNumber,
      visits: appointments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
