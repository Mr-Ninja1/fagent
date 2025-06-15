import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { teamAPI } from '../services/api';
import { setError } from '../store/authSlice';
import { FaPlusCircle, FaFileUpload, FaSave } from 'react-icons/fa';

const CreatePost = () => {
  const { teamId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    media: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        media: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    dispatch(setError(null));

    try {
      const dataToSend = new FormData();
      dataToSend.append('title', formData.title);
      dataToSend.append('content', formData.content);
      if (formData.media) {
        dataToSend.append('media', formData.media);
      }

      await teamAPI.addPost(teamId, dataToSend);
      setSuccessMessage('Post created successfully!');
      setFormData({ title: '', content: '', media: null }); // Clear form
      // Optionally navigate back to dashboard or team details page
      // navigate(`/my-team`); 
    } catch (error) {
      console.error('Error creating post:', error);
      dispatch(setError(error.response?.data?.error || 'Failed to create post.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}><FaPlusCircle /> Create New Post</h1>
      {successMessage && <div style={successMessageStyle}>{successMessage}</div>}
      {dispatch.error && <div style={errorStyle}>{dispatch.error}</div>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="title" style={labelStyle}>Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="content" style={labelStyle}>Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            style={textareaStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="media" style={labelStyle}>Upload Image/Video (Optional)</label>
          <input
            type="file"
            id="media"
            name="media"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            style={fileInputStyle}
          />
          {formData.media && (
            <p style={fileNameStyle}>{formData.media.name}</p>
          )}
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Creating...' : <><FaSave /> Create Post</>}
        </button>
      </form>
    </div>
  );
};

const containerStyle = {
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto',
};

const titleStyle = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};

const formStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const inputGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#555',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '16px',
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  fontSize: '16px',
  minHeight: '120px',
  resize: 'vertical',
};

const fileInputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px dashed #ddd',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#f8f8f8',
};

const fileNameStyle = {
  marginTop: '10px',
  fontSize: '14px',
  color: '#777',
};

const buttonStyle = {
  backgroundColor: '#1a73e8',
  color: 'white',
  padding: '12px 25px',
  border: 'none',
  borderRadius: '5px',
  fontSize: '17px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};

const successMessageStyle = {
  backgroundColor: '#d4edda',
  color: '#155724',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '20px',
  textAlign: 'center',
};

const errorStyle = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '20px',
  textAlign: 'center',
};

export default CreatePost; 