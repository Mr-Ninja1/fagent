import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaFutbol, 
  FaDumbbell, 
  FaTachometerAlt, 
  FaSignInAlt, 
  FaUserPlus,
  FaUserCircle,
  FaSignOutAlt,
  FaUsers,
  FaClipboardList,
  FaCog
} from 'react-icons/fa';
import { authAPI } from '../../services/api';
import { setUser, setToken, setError } from '../../store/authSlice';

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      dispatch(setUser(null));
      dispatch(setToken(null));
      navigate('/login');
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const renderAuthButtons = () => {
    if (!isAuthenticated) {
      return (
        <>
          <li style={navItemStyle}>
            <Link to="/login" style={linkStyle}><FaSignInAlt /> Login</Link>
          </li>
          <li style={navItemStyle}>
            <Link to="/signup" style={signupButtonStyle}><FaUserPlus /> Sign Up</Link>
          </li>
        </>
      );
    }

    return (
      <>
        <li style={navItemStyle}>
          <Link to="/profile" style={linkStyle}>
            <FaUserCircle /> {user?.username}
          </Link>
        </li>
        <li style={navItemStyle}>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </>
    );
  };

  const renderRoleSpecificLinks = () => {
    const commonLinks = (
      <>
        {/* These links are visible to players and unauthenticated users */}
      </>
    );

    if (!isAuthenticated) return commonLinks;

    switch (user?.role) {
      case 'player':
        return (
          <>
            <li style={navItemStyle}>
              <Link to="/teams" style={linkStyle}><FaFutbol /> Football Teams</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/gyms" style={linkStyle}><FaDumbbell /> Gyms</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/applications" style={linkStyle}><FaClipboardList /> My Applications</Link>
            </li>
          </>
        );
      case 'coach':
      case 'instructor':
        return (
          <>
            {/* Coaches and Instructors do not see general team/gym listings in header */}
            <li style={navItemStyle}>
              <Link to="/my-team" style={linkStyle}><FaUsers /> My Team</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/applications" style={linkStyle}><FaClipboardList /> Applications</Link>
            </li>
          </>
        );
      case 'master':
        return (
          <>
            <li style={navItemStyle}>
              <Link to="/teams" style={linkStyle}><FaFutbol /> Football Teams</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/gyms" style={linkStyle}><FaDumbbell /> Gyms</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/applications" style={linkStyle}><FaClipboardList /> All Applications</Link>
            </li>
            <li style={navItemStyle}>
              <Link to="/settings" style={linkStyle}><FaCog /> Settings</Link>
            </li>
          </>
        );
      default:
        return commonLinks;
    }
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <Link to="/" style={linkStyle}>Sport Agent</Link>
      </div>
      <nav>
        <ul style={navListStyle}>
          {renderRoleSpecificLinks()}
          {renderAuthButtons()}
        </ul>
      </nav>
    </header>
  );
};

const headerStyle = {
  backgroundColor: '#1a73e8',
  color: '#fff',
  padding: '15px 30px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
};

const navListStyle = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
};

const navItemStyle = {
  marginLeft: '30px',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'color 0.3s ease',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
};

const signupButtonStyle = {
  ...linkStyle,
  backgroundColor: '#4285f4',
  padding: '8px 15px',
  borderRadius: '20px',
  border: '1px solid #fff',
  transition: 'background-color 0.3s ease, border-color 0.3s ease',
};

const logoutButtonStyle = {
  ...linkStyle,
  backgroundColor: 'transparent',
  border: '1px solid #fff',
  padding: '8px 15px',
  borderRadius: '20px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
};

export default Header; 