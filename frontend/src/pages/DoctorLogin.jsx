import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorLogin } from '../services/api';
import '../styles/Login.css';

export default function DoctorLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Email and password are required' });
      return;
    }

    try {
      setLoading(true);
      await doctorLogin(formData.email, formData.password);
      setMessage({ type: 'success', text: 'Login successful!' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Doctor Login</h1>
        <p className="subtitle">Access your patient appointments</p>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <p>Email: <strong>doctor@example.com</strong></p>
          <p>Password: <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
}
