import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAPI } from '../../services/api';
import { setUser, setToken } from '../../store/authSlice';
import { FaUserPlus, FaFutbol, FaDumbbell, FaUser } from 'react-icons/fa';

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState('role'); // 'role' or 'details'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    setStep('details');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData; // Exclude confirmPassword
      const response = await authAPI.signup(dataToSend);
      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.token));
      localStorage.setItem('token', response.data.token);
      
      // Redirect based on role
      switch(response.data.user.role) {
        case 'coach':
          navigate('/create-team');
          break;
        case 'instructor':
          navigate('/create-team');
          break;
        default:
          navigate('/my-team');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error signing up');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'player',
      label: 'Player',
      icon: <FaUser />,
      description: 'Join teams and gyms, apply for memberships'
    },
    {
      value: 'coach',
      label: 'Football Coach',
      icon: <FaFutbol />,
      description: 'Create and manage football teams'
    },
    {
      value: 'instructor',
      label: 'Gym Instructor',
      icon: <FaDumbbell />,
      description: 'Create and manage gyms'
    }
  ];

  if (step === 'role') {
    return (
      <div style={containerStyle}>
        <div style={formStyle}>
          <h2 style={titleStyle}><FaUserPlus /> Choose Your Role</h2>
          <p style={subtitleStyle}>Select how you'll use Sport Agent</p>
          
          <div style={roleGridStyle}>
            {roleOptions.map(option => (
              <div
                key={option.value}
                style={roleOptionStyle}
                onClick={() => handleRoleSelect(option.value)}
              >
                <div style={roleIconStyle}>{option.icon}</div>
                <div style={roleLabelStyle}>{option.label}</div>
                <div style={roleDescriptionStyle}>{option.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={titleStyle}>
          {formData.role === 'player' && <FaUser />}
          {formData.role === 'coach' && <FaFutbol />}
          {formData.role === 'instructor' && <FaDumbbell />}
          {' '}Sign Up as {roleOptions.find(r => r.value === formData.role)?.label}
        </h2>
        
        {error && <div style={errorStyle}>{error}</div>}

        <div style={inputGroupStyle}>
          <label htmlFor="email">Email</label>
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

        <div style={inputGroupStyle}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="password">Password</label>
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

        <div style={inputGroupStyle}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={buttonGroupStyle}>
          <button 
            type="button" 
            onClick={() => setStep('role')}
            style={backButtonStyle}
          >
            Back
          </button>
          <button 
            type="submit" 
            disabled={loading}
            style={submitButtonStyle}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '20px',
  backgroundColor: '#f5f5f5',
};

const formStyle = {
  backgroundColor: '#e8f0fe',
  padding: '30px',
  borderRadius: '10px',
  border: '1px solid #cce0ff',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '500px',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};

const subtitleStyle = {
  textAlign: 'center',
  color: '#666',
  marginBottom: '30px',
};

const inputGroupStyle = {
  marginBottom: '20px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  fontSize: '16px',
};

const errorStyle = {
  backgroundColor: '#ffebee',
  color: '#c62828',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '20px',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '10px',
};

const submitButtonStyle = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#1a73e8',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const backButtonStyle = {
  padding: '12px 20px',
  backgroundColor: '#f5f5f5',
  color: '#333',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const roleGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px',
};

const roleOptionStyle = {
  border: '2px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  ':hover': {
    borderColor: '#1a73e8',
    backgroundColor: '#e8f0fe',
  },
};

const roleIconStyle = {
  fontSize: '32px',
  marginBottom: '15px',
  color: '#1a73e8',
};

const roleLabelStyle = {
  fontWeight: 'bold',
  marginBottom: '8px',
  fontSize: '18px',
};

const roleDescriptionStyle = {
  fontSize: '14px',
  color: '#666',
  lineHeight: '1.4',
};

export default SignupForm; 