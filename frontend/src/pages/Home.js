import React from 'react';
import { Link } from 'react-router-dom';
import { FaFutbol, FaDumbbell, FaUsers, FaClipboardList, FaBullhorn } from 'react-icons/fa';

const Home = () => {
  return (
    <div style={homePageStyle}>
      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <h1 style={heroTitleStyle}>Connect, Compete, Conquer.</h1>
        <p style={heroSubtitleStyle}>Your ultimate platform for sports team and gym management.</p>
        <div style={heroButtonsStyle}>
          <Link to="/signup" style={heroSignupButtonStyle}>
            Join Now
          </Link>
          <Link to="/teams" style={heroExploreButtonStyle}>
            Explore Teams
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={featuresSectionStyle}>
        <h2 style={sectionTitleStyle}>Key Features</h2>
        <div style={featuresGridStyle}>
          <div style={featureCardStyle}>
            <FaFutbol style={featureIconStyle} />
            <h3 style={featureTitleStyle}>Find Your Team</h3>
            <p style={featureDescriptionStyle}>Browse diverse football teams and gyms, find the perfect fit for your ambitions.</p>
          </div>
          <div style={featureCardStyle}>
            <FaUsers style={featureIconStyle} />
            <h3 style={featureTitleStyle}>Manage Your Roster</h3>
            <p style={featureDescriptionStyle}>Coaches and instructors can easily manage their team members, schedules, and communications.</p>
          </div>
          <div style={featureCardStyle}>
            <FaClipboardList style={featureIconStyle} />
            <h3 style={featureTitleStyle}>Streamlined Applications</h3>
            <p style={featureDescriptionStyle}>Simplify the application process for players and review candidates efficiently.</p>
          </div>
          <div style={featureCardStyle}>
            <FaBullhorn style={featureIconStyle} />
            <h3 style={featureTitleStyle}>Team Communication</h3>
            <p style={featureDescriptionStyle}>Keep your team updated with announcements, posts, and schedules on your dedicated team page.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={ctaSectionStyle}>
        <h2 style={sectionTitleStyle}>Ready to get started?</h2>
        <p style={ctaSubtitleStyle}>Join Fagent today and elevate your sports management experience.</p>
        <Link to="/signup" style={ctaButtonStyle}>
          Sign Up Free
        </Link>
      </section>
    </div>
  );
};

const homePageStyle = {
  textAlign: 'center',
  padding: '0',
  fontSize: '1.2em',
  lineHeight: '1.6',
  color: '#333',
};

const heroSectionStyle = {
  backgroundColor: '#1a73e8',
  color: 'white',
  padding: '100px 20px',
  marginBottom: '50px',
};

const heroTitleStyle = {
  fontSize: '3.5em',
  marginBottom: '20px',
};

const heroSubtitleStyle = {
  fontSize: '1.5em',
  marginBottom: '40px',
};

const heroButtonsStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
};

const heroSignupButtonStyle = {
  backgroundColor: '#4285f4',
  color: 'white',
  padding: '15px 30px',
  borderRadius: '30px',
  textDecoration: 'none',
  fontSize: '1.1em',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
};

const heroExploreButtonStyle = {
  backgroundColor: 'transparent',
  color: 'white',
  padding: '15px 30px',
  borderRadius: '30px',
  border: '2px solid white',
  textDecoration: 'none',
  fontSize: '1.1em',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease, color 0.3s ease',
};

const featuresSectionStyle = {
  padding: '50px 20px',
  backgroundColor: '#f8f9fa',
  marginBottom: '50px',
};

const sectionTitleStyle = {
  fontSize: '2.5em',
  marginBottom: '40px',
  color: '#333',
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '30px',
  maxWidth: '1000px',
  margin: '0 auto',
};

const featureCardStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.3s ease',
};

const featureIconStyle = {
  fontSize: '3em',
  color: '#1a73e8',
  marginBottom: '20px',
};

const featureTitleStyle = {
  fontSize: '1.5em',
  marginBottom: '10px',
  color: '#333',
};

const featureDescriptionStyle = {
  fontSize: '1em',
  color: '#666',
};

const ctaSectionStyle = {
  padding: '50px 20px',
  backgroundColor: '#e3f2fd',
  marginBottom: '0',
};

const ctaSubtitleStyle = {
  fontSize: '1.2em',
  marginBottom: '30px',
  color: '#555',
};

const ctaButtonStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  padding: '15px 30px',
  borderRadius: '30px',
  textDecoration: 'none',
  fontSize: '1.1em',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
};

export default Home; 