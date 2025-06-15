import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { teamAPI } from '../services/api';
import { setError } from '../store/authSlice';

const CreateTeam = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    logo: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Attempting to create team with formData:', formData);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('type', user.role === 'coach' ? 'football' : 'gym');

      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }
      formDataToSend.append('ownerId', user.id);

      // Log FormData contents before sending
      for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}: ${value}`);
      }

      const response = await teamAPI.createTeam(formDataToSend);
      console.log('Team creation successful:', response.data);
      navigate(`/teams/${response.data.id}`);
    } catch (error) {
      console.error('Create team error:', error);
      dispatch(setError(error.response?.data?.error || 'Failed to create team. Please check your input.'));
      console.error('Backend Error Response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const isCoach = user?.role === 'coach';
  const isInstructor = user?.role === 'instructor';

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Create Your {isCoach ? 'Team' : isInstructor ? 'Gym' : ''} Page</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Basic Information</h2>
          <input
            type="text"
            name="name"
            placeholder="Team/Gym Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <div style={logoUploadStyle}>
            <label htmlFor="logo" style={logoLabelStyle}>
              Upload {isCoach ? 'Team' : isInstructor ? 'Gym' : ''} Logo
            </label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*"
              onChange={handleLogoChange}
              style={fileInputStyle}
            />
            {formData.logo && (
              <p style={fileNameStyle}>{formData.logo.name}</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Creating...' : `Create ${isCoach ? 'Team' : isInstructor ? 'Gym' : ''} Page`}
        </button>
      </form>
    </div>
  );
};

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
};

const titleStyle = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '30px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const sectionStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const sectionTitleStyle = {
  color: '#444',
  marginBottom: '15px',
  fontSize: '1.2em',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '16px',
};

const logoUploadStyle = {
  marginTop: '20px',
};

const logoLabelStyle = {
  display: 'block',
  marginBottom: '10px',
  color: '#666',
};

const fileInputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px dashed #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
};

const fileNameStyle = {
  marginTop: '5px',
  fontSize: '14px',
  color: '#666',
};

const buttonStyle = {
  backgroundColor: '#1a73e8',
  color: 'white',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  ':hover': {
    backgroundColor: '#1557b0',
  },
};

export default CreateTeam; 