import React, { useState } from 'react';
import { FaCog, FaSave, FaUndo } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    allowDirectMessages: false,
    requireEmailVerification: true,
    maxTeamSize: 20,
    applicationDeadline: 7, // days
    autoRejectAfter: 30, // days
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement settings update
  };

  const handleReset = () => {
    setSettings({
      allowDirectMessages: false,
      requireEmailVerification: true,
      maxTeamSize: 20,
      applicationDeadline: 7,
      autoRejectAfter: 30,
    });
  };

  return (
    <div style={containerStyle}>
      <div style={settingsCardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <FaCog /> System Settings
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Communication Settings</h2>
            
            <div style={fieldStyle}>
              <label style={labelStyle}>
                <input
                  type="checkbox"
                  name="allowDirectMessages"
                  checked={settings.allowDirectMessages}
                  onChange={handleChange}
                  style={checkboxStyle}
                />
                Allow direct messages between players and coaches
              </label>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                <input
                  type="checkbox"
                  name="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onChange={handleChange}
                  style={checkboxStyle}
                />
                Require email verification for new accounts
              </label>
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Team Settings</h2>
            
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Maximum team size:
                <input
                  type="number"
                  name="maxTeamSize"
                  value={settings.maxTeamSize}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  style={numberInputStyle}
                />
              </label>
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Application Settings</h2>
            
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Application deadline (days):
                <input
                  type="number"
                  name="applicationDeadline"
                  value={settings.applicationDeadline}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  style={numberInputStyle}
                />
              </label>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                Auto-reject after (days):
                <input
                  type="number"
                  name="autoRejectAfter"
                  value={settings.autoRejectAfter}
                  onChange={handleChange}
                  min="1"
                  max="90"
                  style={numberInputStyle}
                />
              </label>
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <button type="submit" style={saveButtonStyle}>
              <FaSave /> Save Settings
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={resetButtonStyle}
            >
              <FaUndo /> Reset to Default
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const containerStyle = {
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto',
};

const settingsCardStyle = {
  backgroundColor: 'white',
  borderRadius: '10px',
  padding: '30px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const headerStyle = {
  marginBottom: '30px',
};

const titleStyle = {
  margin: 0,
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const sectionStyle = {
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '5px',
};

const sectionTitleStyle = {
  margin: '0 0 20px 0',
  color: '#333',
  fontSize: '20px',
};

const fieldStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#333',
};

const checkboxStyle = {
  width: '18px',
  height: '18px',
};

const numberInputStyle = {
  width: '80px',
  padding: '5px',
  marginLeft: '10px',
  borderRadius: '3px',
  border: '1px solid #ddd',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '20px',
};

const saveButtonStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

const resetButtonStyle = {
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

export default Settings; 