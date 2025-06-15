import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { teamAPI, applicationAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaPlusCircle, FaCog } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [team, setTeam] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || (!user.role.includes('coach') && !user.role.includes('instructor'))) {
        setError('You must be a coach or instructor to view this dashboard.');
        setLoading(false);
        return;
      }

      try {
        // Fetch the team/gym owned by the current user
        const teamResponse = await teamAPI.getTeams({ ownerId: user.id });
        if (teamResponse.data && teamResponse.data.teams.length > 0) {
          const userTeam = teamResponse.data.teams[0];
          setTeam(userTeam);

          // Fetch applications for this team
          const applicationsResponse = await applicationAPI.getTeamApplications(userTeam.id);
          setApplications(applicationsResponse.data);
        } else {
          setError('No team or gym found for your account. Please create one.');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <div style={centerMessageStyle}>Loading your dashboard...</div>;
  }

  if (error) {
    return <div style={centerMessageStyle}>{error}</div>;
  }

  if (!team) {
    return (
      <div style={centerMessageStyle}>
        <p>You don't have a team or gym created yet.</p>
        <Link to="/create-team" style={createTeamLinkStyle}>Create Your Team/Gym</Link>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedMembers = applications.filter(app => app.status === 'approved_by_master' || app.status === 'approved_by_coach'); // Assuming accepted applications mean members

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <img src={team.logo || '/default-team-logo.png'} alt={team.name} style={teamLogoStyle} />
        <div>
          <h1 style={teamNameStyle}>{team.name} Dashboard</h1>
          <p style={teamDescriptionStyle}>{team.description}</p>
          <p style={teamLocationStyle}>{team.location}</p>
        </div>
      </div>

      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <FaUsers style={statIconStyle} />
          <h3>{acceptedMembers.length}</h3>
          <p>Members</p>
        </div>
        <div style={statCardStyle}>
          <FaClipboardList style={statIconStyle} />
          <h3>{pendingApplications.length}</h3>
          <p>Pending Applications</p>
        </div>
      </div>

      <div style={linksGridStyle}>
        <Link to={`/teams/${team.id}/applications`} style={dashboardLinkStyle}>
          <FaClipboardList /> Manage Applications
        </Link>
        <Link to={`/teams/${team.id}/posts`} style={dashboardLinkStyle}>
          <FaPlusCircle /> Create New Post
        </Link>
        <Link to={`/teams/${team.id}/settings`} style={dashboardLinkStyle}>
          <FaCog /> Team Settings
        </Link>
      </div>
    </div>
  );
};

const containerStyle = {
  padding: '20px',
  maxWidth: '1000px',
  margin: '0 auto',
};

const centerMessageStyle = {
  textAlign: 'center',
  padding: '50px',
};

const createTeamLinkStyle = {
  backgroundColor: '#1a73e8',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  textDecoration: 'none',
  marginTop: '20px',
  display: 'inline-block',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '30px',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const teamLogoStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #ddd',
};

const teamNameStyle = {
  margin: '0 0 5px 0',
  color: '#333',
  fontSize: '28px',
};

const teamDescriptionStyle = {
  margin: '0 0 5px 0',
  color: '#666',
};

const teamLocationStyle = {
  margin: '0',
  color: '#888',
  fontSize: '14px',
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '30px',
};

const statCardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center',
};

const statIconStyle = {
  fontSize: '3em',
  color: '#1a73e8',
  marginBottom: '10px',
};

const linksGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
};

const dashboardLinkStyle = {
  backgroundColor: '#4285f4',
  color: 'white',
  padding: '15px 20px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  fontSize: '1.1em',
  transition: 'background-color 0.3s ease',
};

export default Dashboard; 