import React, { useState, useEffect } from 'react';
import { getAvailableSlots, bookAppointment } from '../services/api';
import '../styles/BookingForm.css';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    date: '',
    timeSlot: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchAvailableSlots = async () => {
    if (!formData.date) return;

    try {
      setLoading(true);
      const data = await getAvailableSlots(formData.date);
      setAvailableSlots(data.availableSlots);
      setBookedSlots(data.bookedSlots);
      setMessage(null);
    } catch (error) {
      setMessage({ type: 'error', text: error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientName || !formData.phoneNumber || !formData.age || !formData.gender || !formData.date || !formData.timeSlot) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    try {
      setLoading(true);
      await bookAppointment({
        patientName: formData.patientName,
        phoneNumber: formData.phoneNumber,
        age: parseInt(formData.age),
        gender: formData.gender,
        date: formData.date,
        timeSlot: formData.timeSlot,
      });

      const appointmentDate = new Date(formData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      // Clear form immediately
      setFormData({
        patientName: '',
        phoneNumber: '',
        age: '',
        gender: '',
        date: '',
        timeSlot: '',
      });
      setAvailableSlots([]);

      // Show success message
      setMessage({
        type: 'success',
        text: `🎉 Booking Confirmed! We Look Forward to Seeing You!\n\nAppointment Details:\n━━━━━━━━━━━━━━━━━━━━━\nDate: ${appointmentDate}\nTime Slot: ${formData.timeSlot}\nPatient Name: ${formData.patientName}\n━━━━━━━━━━━━━━━━━━━━━\n\n✓ Your appointment has been successfully reserved.\n✓ Please arrive 10 minutes early.\n✓ Bring any relevant medical documents.\n\nThank you for choosing our clinic!`,
      });

      // Hide message after 15 seconds
      setTimeout(() => {
        setMessage(null);
        // Refresh slots
        if (formData.date) {
          fetchAvailableSlots();
        }
      }, 15000);
    } catch (error) {
      setMessage({ type: 'error', text: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h1>Book Your Appointment</h1>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="patientName">Full Name *</label>
            <input
              id="patientName"
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter your age"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Preferred Date *</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {formData.date && (
            <div className="form-group">
              <label htmlFor="timeSlot">Preferred Time Slot *</label>
              {loading && availableSlots.length === 0 ? (
                <div className="loading">Loading available slots...</div>
              ) : (
                <>
                  {availableSlots.length > 0 ? (
                    <div className="slot-grid">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`slot-button ${formData.timeSlot === slot ? 'selected' : ''}`}
                          onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="no-slots">No available slots for this date</p>
                  )}

                  {bookedSlots.length > 0 && (
                    <p className="booked-slots-info">
                      Booked slots for this date: {bookedSlots.join(', ')}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn-submit"
            disabled={loading || !availableSlots.includes(formData.timeSlot)}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
