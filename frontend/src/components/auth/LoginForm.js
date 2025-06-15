import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAPI } from '../../services/api';
import { setUser, setToken } from '../../store/authSlice';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.token));
      localStorage.setItem('token', response.data.token);

      // Redirect to the page they were trying to access, or dashboard
      const from = location.state?.from || '/my-team';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Login</h2>
        {location.state?.message && (
          <div style={messageStyle}>
            {location.state.message}
          </div>
        )}
        {error && <div style={errorStyle}>{error}</div>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 64px)',
  padding: '20px',
};

const formContainerStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px',
};

const titleStyle = {
  margin: '0 0 20px 0',
  textAlign: 'center',
  color: '#333',
};

const messageStyle = {
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '20px',
  textAlign: 'center',
};

const errorStyle = {
  backgroundColor: '#ffebee',
  color: '#c62828',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '20px',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const labelStyle = {
  color: '#666',
  fontSize: '14px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '16px',
};

const buttonStyle = {
  backgroundColor: '#1a73e8',
  color: 'white',
  padding: '12px',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

export default LoginForm; 