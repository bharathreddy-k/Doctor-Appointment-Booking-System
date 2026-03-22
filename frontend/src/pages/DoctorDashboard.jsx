import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAppointments, doctorLogout } from '../services/api';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/Dashboard.css';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAppointments();
      setAppointments(data);
      setMessage(null);
    } catch (error) {
      setMessage({ type: 'error', text: error });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleLogout = () => {
    doctorLogout();
    navigate('/');
  };

  const handleRefresh = () => {
    fetchAppointments();
  };

  const handleAppointmentUpdate = () => {
    fetchAppointments();
    setSelectedAppointment(null);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <div className="header-actions">
          <button className="btn-refresh" onClick={handleRefresh}>
            Refresh
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading appointments...</div>
        ) : (
          <>
            <div className="appointments-section">
              <h2>Appointments ({appointments.length})</h2>

              {appointments.length === 0 ? (
                <p className="no-appointments">No appointments scheduled yet</p>
              ) : (
                <div className="appointments-grid">
                  {appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onSelect={setSelectedAppointment}
                    />
                  ))}
                </div>
              )}
            </div>

            {selectedAppointment && (
              <div className="detail-modal-overlay" onClick={() => setSelectedAppointment(null)}>
                <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="close-button"
                    onClick={() => setSelectedAppointment(null)}
                  >
                    ×
                  </button>
                  <AppointmentDetail
                    appointment={selectedAppointment}
                    onUpdate={handleAppointmentUpdate}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AppointmentDetail({ appointment, onUpdate }) {
  const [details, setDetails] = useState({
    height: appointment.visitDetails?.height || '',
    weight: appointment.visitDetails?.weight || '',
    temperature: appointment.visitDetails?.temperature || '',
    pulse: appointment.visitDetails?.pulse || '',
    prescription: appointment.visitDetails?.prescription || '',
  });

  const [previousVisits, setPreviousVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const { getAppointmentDetails } = await import('../services/api');
      const data = await getAppointmentDetails(appointment._id);
      setPreviousVisits(data.previousVisits || []);
    } catch (error) {
      setMessage({ type: 'error', text: error });
    } finally {
      setLoading(false);
    }
  }, [appointment._id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const { updateAppointmentDetails } = await import('../services/api');
      await updateAppointmentDetails(appointment._id, details);
      setMessage({ type: 'success', text: 'Details saved successfully!' });
      setTimeout(() => onUpdate(), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="appointment-detail">
      <h2>Patient Details</h2>

      <div className="patient-info">
        <div className="info-row">
          <span className="label">Name:</span>
          <span className="value">{appointment.patient.name}</span>
        </div>
        <div className="info-row">
          <span className="label">Phone:</span>
          <span className="value">{appointment.patient.phoneNumber}</span>
        </div>
        <div className="info-row">
          <span className="label">Age:</span>
          <span className="value">{appointment.patient.age}</span>
        </div>
        <div className="info-row">
          <span className="label">Gender:</span>
          <span className="value">{appointment.patient.gender}</span>
        </div>
        <div className="info-row">
          <span className="label">Date:</span>
          <span className="value">{new Date(appointment.date).toLocaleDateString()}</span>
        </div>
        <div className="info-row">
          <span className="label">Time:</span>
          <span className="value">{appointment.timeSlot}</span>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        <h3>Visit Examination Details</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              id="height"
              type="text"
              name="height"
              value={details.height}
              onChange={handleInputChange}
              placeholder="e.g., 175"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              id="weight"
              type="text"
              name="weight"
              value={details.weight}
              onChange={handleInputChange}
              placeholder="e.g., 75"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="temperature">Temperature (°C)</label>
            <input
              id="temperature"
              type="text"
              name="temperature"
              value={details.temperature}
              onChange={handleInputChange}
              placeholder="e.g., 98.6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pulse">Pulse (bpm)</label>
            <input
              id="pulse"
              type="text"
              name="pulse"
              value={details.pulse}
              onChange={handleInputChange}
              placeholder="e.g., 72"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="prescription">Prescription</label>
          <textarea
            id="prescription"
            name="prescription"
            value={details.prescription}
            onChange={handleInputChange}
            placeholder="Enter prescription details..."
            rows="4"
          />
        </div>

        <button type="submit" className="btn-save" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Details'}
        </button>
      </form>

      {loading ? (
        <div className="loading">Loading previous visits...</div>
      ) : previousVisits.length > 0 ? (
        <div className="previous-visits">
          <h3>Previous Visit History</h3>
          {previousVisits.map((visit, index) => (
            <div key={index} className="visit-record">
              <div className="visit-date">
                {new Date(visit.date).toLocaleDateString()} at {visit.timeSlot}
              </div>
              {visit.prescription && (
                <div className="visit-details">
                  <strong>Prescription:</strong>
                  <p>{visit.prescription}</p>
                </div>
              )}
              {visit.details && (
                <div className="visit-vitals">
                  {visit.details.height && <span>H: {visit.details.height}cm</span>}
                  {visit.details.weight && <span>W: {visit.details.weight}kg</span>}
                  {visit.details.temperature && <span>T: {visit.details.temperature}°C</span>}
                  {visit.details.pulse && <span>P: {visit.details.pulse}bpm</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
