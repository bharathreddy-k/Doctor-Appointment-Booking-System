import React from 'react';
import '../styles/AppointmentCard.css';

export default function AppointmentCard({ appointment, onSelect }) {
  const appointmentDate = new Date(appointment.date);
  const dateStr = appointmentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="appointment-card" onClick={() => onSelect(appointment)}>
      <div className="card-header">
        <h3>{appointment.patient.name}</h3>
        <span className={`status ${appointment.isCompleted ? 'completed' : 'pending'}`}>
          {appointment.isCompleted ? 'Completed' : 'Pending'}
        </span>
      </div>

      <div className="card-body">
        <div className="info-item">
          <span className="label">Phone:</span>
          <span className="value">{appointment.patient.phoneNumber}</span>
        </div>
        <div className="info-item">
          <span className="label">Date:</span>
          <span className="value">{dateStr}</span>
        </div>
        <div className="info-item">
          <span className="label">Time:</span>
          <span className="value">{appointment.timeSlot}</span>
        </div>
        <div className="info-item">
          <span className="label">Age/Gender:</span>
          <span className="value">
            {appointment.patient.age} / {appointment.patient.gender}
          </span>
        </div>
      </div>

      <div className="card-footer">
        <button className="btn-view-details">
          View Details & Add Findings
        </button>
      </div>
    </div>
  );
}
