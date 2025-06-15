import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { teamAPI } from '../services/api';
import { FaSearch, FaPlus } from 'react-icons/fa';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchFootballTeams = async () => {
      try {
        const response = await teamAPI.getTeams({ type: 'football' }); // Filter by type 'football'
        setTeams(response.data.teams);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch football teams');
        setLoading(false);
      }
    };

    fetchFootballTeams();
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading football teams...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Football Teams</h1>
        {(user?.role === 'coach') && (
          <Link to="/create-team" style={createButtonStyle}>
            <FaPlus /> Create Team
          </Link>
        )}
      </div>

      <div style={searchContainerStyle}>
        <div style={searchBoxStyle}>
          <FaSearch style={searchIconStyle} />
          <input
            type="text"
            placeholder="Search football teams by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>
      </div>

      <div style={teamsGridStyle}>
        {filteredTeams.map(team => (
          <Link to={`/teams/${team.id}`} key={team.id} style={teamCardStyle}>
            <div style={teamImageContainerStyle}>
              <img 
                src={`http://localhost:5000${team.logo || '/default-team-logo.png'}`} 
                alt={team.name}
                style={teamImageStyle}
              />
            </div>
            <div style={teamInfoStyle}>
              <h3 style={teamNameStyle}>{team.name}</h3>
              <p style={teamLocationStyle}>{team.location}</p>
              {team.owner && <p style={ownerNameStyle}>Coach: {team.owner.username}</p>}
              <div style={teamStatsStyle}>
                <span>{team.players?.length || 0} Players</span>
                <span>{team.posts?.length || 0} Posts</span>
              </div>
            </div>
          </Link>
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

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
};

const createButtonStyle = {
  backgroundColor: '#1a73e8',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'background-color 0.3s ease',
};

const searchContainerStyle = {
  marginBottom: '30px',
};

const searchBoxStyle = {
  position: 'relative',
  maxWidth: '600px',
  margin: '0 auto',
};

const searchIconStyle = {
  position: 'absolute',
  left: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#666',
};

const searchInputStyle = {
  width: '100%',
  padding: '12px 20px 12px 45px',
  borderRadius: '25px',
  border: '1px solid #ddd',
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.3s ease',
};

const teamsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
};

const teamCardStyle = {
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  display: 'block',
};

const teamImageContainerStyle = {
  width: '100%',
  height: '200px',
  overflow: 'hidden',
};

const teamImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const teamInfoStyle = {
  padding: '15px',
};

const teamNameStyle = {
  margin: '0 0 10px 0',
  fontSize: '18px',
  color: '#333',
};

const teamLocationStyle = {
  margin: '0 0 10px 0',
  color: '#666',
  fontSize: '14px',
};

const teamStatsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  color: '#888',
  fontSize: '14px',
};

const ownerNameStyle = {
  margin: '0 0 5px 0',
  color: '#555',
  fontSize: '14px',
  fontWeight: 'bold',
};

export default Teams; 