import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookingForm from './components/BookingForm';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🏥 Doctor Appointment System
            </Link>
            <div className="nav-links">
              <Link to="/">Patient Booking</Link>
              <Link to="/doctor-login">Doctor Login</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<BookingForm />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2024 Doctor Appointment Booking System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
