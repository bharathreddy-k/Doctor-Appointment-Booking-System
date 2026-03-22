import Doctor from '../models/Doctor.js';
import jwt from 'jsonwebtoken';

export const registerDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res.status(400).json({ message: 'Doctor already registered' });
    }

    doctor = new Doctor({ email, password });
    await doctor.save();

    const token = jwt.sign({ id: doctor._id, email: doctor.email }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({
      message: 'Doctor registered successfully',
      token,
      doctor: { id: doctor._id, email: doctor.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let doctor = await Doctor.findOne({ email });

    if (!doctor) {
      // Auto-create doctor if it doesn't exist (for demo purposes)
      if (email === process.env.DOCTOR_EMAIL) {
        doctor = new Doctor({
          email,
          password: process.env.DOCTOR_PASSWORD,
        });
        await doctor.save();
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    // Check if provided password matches database password (if auto-created)
    const isValidPassword = await doctor.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: doctor._id, email: doctor.email }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login successful',
      token,
      doctor: { id: doctor._id, email: doctor.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
