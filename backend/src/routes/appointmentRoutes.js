import express from 'express';
import {
  getAvailableSlots,
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentDetails,
  getPatientHistory,
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/available-slots', getAvailableSlots);
router.post('/book', bookAppointment);

// Protected routes (doctor only)
router.get('/all', authMiddleware, getAllAppointments);
router.get('/:id', authMiddleware, getAppointmentById);
router.put('/:id', authMiddleware, updateAppointmentDetails);
router.get('/patient-history/:phoneNumber', authMiddleware, getPatientHistory);

export default router;
