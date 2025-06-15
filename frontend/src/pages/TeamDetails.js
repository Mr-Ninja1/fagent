import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { teamAPI, applicationAPI } from '../services/api';
import { FaUserPlus, FaEdit, FaTrash, FaCalendarAlt, FaBullhorn, FaNewspaper, FaSignInAlt, FaUsers, FaClipboardList } from 'react-icons/fa';

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await teamAPI.getTeam(id);
        setTeam(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch team details');
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/teams/${id}`, message: 'Please login to apply to this team' } });
      return;
    }
    try {
      await applicationAPI.submitApplication(id, applicationMessage);
      setShowApplicationForm(false);
      setApplicationMessage('');
      // Show success message
    } catch (err) {
      setError('Failed to submit application');
    }
  };

  if (loading) return <div>Loading team details...</div>;
  if (error) return <div>{error}</div>;
  if (!team) return <div>Team not found</div>;

  const isCoach = user?.role === 'coach' || user?.role === 'instructor';
  const isPlayer = user?.role === 'player';

  return (
    <div style={containerStyle}>
      {/* Page Header - mimicking a cover photo/info area */}
      <div style={pageHeaderStyle}>
        <div style={teamInfoContainerStyle}> {/* This was the old headerStyle */}
          <div style={teamInfoStyle}>
            <img
              src={`http://localhost:5000${team.logo || '/default-team-logo.png'}`}
              alt={team.name}
              style={logoStyle}
            />
            <div>
              <h1 style={teamNameStyle}>{team.name}</h1>
              <p style={locationStyle}>{team.location}</p>
            </div>
          </div>
          {!isCoach && (
            <button 
              onClick={() => setShowApplicationForm(true)}
              style={applyButtonStyle}
            >
              {isAuthenticated ? <FaUserPlus /> : <FaSignInAlt />}
              {isAuthenticated ? 'Apply to Team' : 'Join Team'}
            </button>
          )}
        </div>

        {/* Coach/Instructor Specific Actions */}
        {isCoach && (
          <div style={coachActionsContainerStyle}>
            <button
              onClick={() => navigate(`/teams/${team.id}/posts`)}
              style={actionButtonStyle}
            >
              <FaNewspaper /> Create Post
            </button>
            <button
              onClick={() => navigate(`/applications`)} 
              style={actionButtonStyle}
            >
              <FaClipboardList /> Manage Applications
            </button>
            <button
              onClick={() => navigate(`/teams/${team.id}/members`)} 
              style={actionButtonStyle}
            >
              <FaUsers /> View Members
            </button>
          </div>
        )}
      </div>

      {showApplicationForm && (
        <div style={applicationFormStyle}>
          <h3>{isAuthenticated ? 'Apply to' : 'Join'} {team.name}</h3>
          {!isAuthenticated && (
            <div style={loginPromptStyle}>
              <p>Please login or create an account to join this team.</p>
              <div style={loginButtonsStyle}>
                <button 
                  onClick={() => navigate('/login', { state: { from: `/teams/${id}` } })}
                  style={loginButtonStyle}
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup', { state: { from: `/teams/${id}` } })}
                  style={signupButtonStyle}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
          {isAuthenticated && (
            <form onSubmit={handleApply}>
              <textarea
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                placeholder="Tell us why you want to join this team..."
                style={textareaStyle}
                required
              />
              <div style={formButtonsStyle}>
                <button type="submit" style={submitButtonStyle}>Submit Application</button>
                <button 
                  type="button" 
                  onClick={() => setShowApplicationForm(false)}
                  style={cancelButtonStyle}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div style={contentStyle}>
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <FaNewspaper /> Posts
          </h2>
          {(Array.isArray(team.blogPostsContent) ? team.blogPostsContent : []).map(post => (
            <div key={post.id} style={postStyle}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <img src={post.mediaUrls[0]} alt="Post media" style={postMediaStyle} />
              )}
              {isCoach && (
                <div style={postActionsStyle}>
                  <button style={editButtonStyle}><FaEdit /> Edit</button>
                  <button style={deleteButtonStyle}><FaTrash /> Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <FaBullhorn /> Announcements
          </h2>
          {(Array.isArray(team.announcementsContent) ? team.announcementsContent : []).map(announcement => (
            <div key={announcement.id} style={announcementStyle}>
              <h3>{announcement.title}</h3>
              <p>{announcement.content}</p>
              {isCoach && (
                <div style={postActionsStyle}>
                  <button style={editButtonStyle}><FaEdit /> Edit</button>
                  <button style={deleteButtonStyle}><FaTrash /> Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            <FaCalendarAlt /> Schedule
          </h2>
          {(Array.isArray(team.scheduleContent) ? team.scheduleContent : []).map(event => (
            <div key={event.id} style={eventStyle}>
              <h3>{event.title}</h3>
              <p>{event.date} - {event.time}</p>
              <p>{event.description}</p>
              {isCoach && (
                <div style={postActionsStyle}>
                  <button style={editButtonStyle}><FaEdit /> Edit</button>
                  <button style={deleteButtonStyle}><FaTrash /> Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const pageHeaderStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '30px',
};

const teamInfoContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const teamInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
};

const logoStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
};

const teamNameStyle = {
  margin: '0 0 10px 0',
  fontSize: '24px',
  color: '#333',
};

const locationStyle = {
  margin: '0',
  color: '#666',
};

const applyButtonStyle = {
  backgroundColor: '#1a73e8',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const coachActionsContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '15px',
  paddingTop: '10px',
  borderTop: '1px solid #eee',
  marginTop: '10px',
};

const actionButtonStyle = {
  backgroundColor: '#f0f2f5',
  color: '#333',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '1em',
  fontWeight: 'bold',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#e4e6eb',
  },
};

const applicationFormStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '30px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const textareaStyle = {
  width: '100%',
  minHeight: '150px',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  resize: 'vertical',
};

const formButtonsStyle = {
  display: 'flex',
  gap: '10px',
};

const submitButtonStyle = {
  backgroundColor: '#1a73e8',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

const cancelButtonStyle = {
  backgroundColor: '#666',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

const contentStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
};

const sectionStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const sectionTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px',
  color: '#333',
};

const postStyle = {
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: '#f8f9fa',
  borderRadius: '5px',
};

const announcementStyle = {
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: '#fff3cd',
  borderRadius: '5px',
};

const eventStyle = {
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: '#d4edda',
  borderRadius: '5px',
};

const postActionsStyle = {
  display: 'flex',
  gap: '10px',
  marginTop: '10px',
};

const editButtonStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '3px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

const deleteButtonStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '3px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

const loginPromptStyle = {
  textAlign: 'center',
  marginBottom: '20px',
};

const loginButtonsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '15px',
};

const loginButtonStyle = {
  backgroundColor: '#1a73e8',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

const signupButtonStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

const postMediaStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: '5px',
  marginTop: '10px',
};

export default TeamDetails; 