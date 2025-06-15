import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { applicationAPI } from '../services/api';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        let response;
        if (user.role === 'master') {
          response = await applicationAPI.getAllApplications();
        } else if (user.role === 'coach' || user.role === 'instructor') {
          response = await applicationAPI.getTeamApplications(user.teamId);
        } else {
          response = await applicationAPI.getTeamApplications();
        }
        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const handleReview = async (applicationId, status, response) => {
    try {
      if (user.role === 'coach' || user.role === 'instructor') {
        await applicationAPI.coachReview(applicationId, status, response);
      } else if (user.role === 'master') {
        await applicationAPI.masterReview(applicationId, status, response);
      }
      // Refresh applications after review
      const updatedApplications = applications.map(app =>
        app.id === applicationId
          ? { ...app, status, response }
          : app
      );
      setApplications(updatedApplications);
    } catch (err) {
      setError('Failed to update application');
    }
  };

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        {user.role === 'master' ? 'All Applications' :
         user.role === 'player' ? 'My Applications' :
         'Team Applications'}
      </h1>

      <div style={applicationsListStyle}>
        {applications.map(application => (
          <div key={application.id} style={applicationCardStyle}>
            <div style={applicationHeaderStyle}>
              <div>
                <h3 style={playerNameStyle}>{application.player.username}</h3>
                <p style={teamNameStyle}>{application.team.name}</p>
              </div>
              <div style={statusStyle(application.status)}>
                {application.status}
              </div>
            </div>

            <div style={messageStyle}>
              <h4>Application Message:</h4>
              <p>{application.message}</p>
            </div>

            {application.coachResponse && (
              <div style={responseStyle}>
                <h4>Coach's Response:</h4>
                <p>{application.coachResponse}</p>
              </div>
            )}

            {application.masterResponse && (
              <div style={responseStyle}>
                <h4>Master's Response:</h4>
                <p>{application.masterResponse}</p>
              </div>
            )}

            {((user.role === 'coach' || user.role === 'instructor') && application.status === 'pending') && (
              <div style={actionsStyle}>
                <button
                  onClick={() => handleReview(application.id, 'approve', 'Application approved by coach')}
                  style={approveButtonStyle}
                >
                  <FaCheck /> Approve
                </button>
                <button
                  onClick={() => handleReview(application.id, 'reject', 'Application rejected by coach')}
                  style={rejectButtonStyle}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            )}

            {(user.role === 'master' && application.status === 'approved_by_coach') && (
              <div style={actionsStyle}>
                <button
                  onClick={() => handleReview(application.id, 'approve', 'Application approved by master')}
                  style={approveButtonStyle}
                >
                  <FaCheck /> Approve
                </button>
                <button
                  onClick={() => handleReview(application.id, 'reject', 'Application rejected by master')}
                  style={rejectButtonStyle}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const containerStyle = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const titleStyle = {
  marginBottom: '30px',
  color: '#333',
};

const applicationsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const applicationCardStyle = {
  backgroundColor: 'white',
  borderRadius: '10px',
  padding: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const applicationHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
};

const playerNameStyle = {
  margin: '0 0 5px 0',
  color: '#333',
};

const teamNameStyle = {
  margin: '0',
  color: '#666',
};

const statusStyle = (status) => ({
  padding: '5px 10px',
  borderRadius: '15px',
  fontSize: '14px',
  backgroundColor:
    status === 'pending' ? '#ffd700' :
    status === 'approved_by_coach' ? '#90EE90' :
    status === 'approved_by_master' ? '#98FB98' :
    '#ff6b6b',
  color: '#333',
});

const messageStyle = {
  marginBottom: '15px',
  padding: '15px',
  backgroundColor: '#f8f9fa',
  borderRadius: '5px',
};

const responseStyle = {
  marginBottom: '15px',
  padding: '15px',
  backgroundColor: '#e9ecef',
  borderRadius: '5px',
};

const actionsStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '15px',
};

const approveButtonStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

const rejectButtonStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

export default Applications; 