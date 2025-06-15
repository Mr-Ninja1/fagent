import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Team API calls
export const teamAPI = {
  createTeam: (teamData) => api.post('/teams', teamData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getTeam: (teamId) => api.get(`/teams/${teamId}`),
  updateTeam: (teamId, teamData) => api.put(`/teams/${teamId}`, teamData),
  deleteTeam: (teamId) => api.delete(`/teams/${teamId}`),
  getTeams: (params) => api.get('/teams', { params }),
  addPost: (teamId, postData) => api.post(`/teams/${teamId}/posts`, postData),
  updatePost: (teamId, postId, postData) => api.put(`/teams/${teamId}/posts/${postId}`, postData),
  deletePost: (teamId, postId) => api.delete(`/teams/${teamId}/posts/${postId}`),
  addAnnouncement: (teamId, announcementData) => api.post(`/teams/${teamId}/announcements`, announcementData),
  updateAnnouncement: (teamId, announcementId, announcementData) => 
    api.put(`/teams/${teamId}/announcements/${announcementId}`, announcementData),
  deleteAnnouncement: (teamId, announcementId) => 
    api.delete(`/teams/${teamId}/announcements/${announcementId}`),
  updateSchedule: (teamId, scheduleData) => api.put(`/teams/${teamId}/schedule`, scheduleData),
  joinTeam: (teamId) => api.post(`/teams/${teamId}/join`),
  leaveTeam: (teamId) => api.post(`/teams/${teamId}/leave`),
  getTeamMembers: (teamId) => api.get(`/teams/${teamId}/members`),
  updateTeamMember: (teamId, memberId, data) => 
    api.put(`/teams/${teamId}/members/${memberId}`, data),
  removeTeamMember: (teamId, memberId) => 
    api.delete(`/teams/${teamId}/members/${memberId}`),
};

export const applicationAPI = {
  submitApplication: (teamId, message) => api.post('/applications', { teamId, message }),
  getTeamApplications: (teamId) => api.get(`/applications/team/${teamId}`),
  getAllApplications: () => api.get('/applications/all'),
  coachReview: (applicationId, status, response) => 
    api.put(`/applications/${applicationId}/coach-review`, { status, response }),
  masterReview: (applicationId, status, response) => 
    api.put(`/applications/${applicationId}/master-review`, { status, response }),
};

export default api; 