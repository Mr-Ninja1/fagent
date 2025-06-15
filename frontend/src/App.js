import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store';
import { authAPI } from './services/api';
import { setUser, setToken } from './store/authSlice';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';
import CreateTeam from './pages/CreateTeam';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import TeamDetails from './pages/TeamDetails';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Gyms from './pages/Gyms';
import CreatePost from './pages/CreatePost';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          dispatch(setUser(response.data));
          dispatch(setToken(token));
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };

    if (!isAuthenticated) {
      initializeAuth();
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/gyms" element={<Gyms />} />
      <Route path="/teams/:id" element={<TeamDetails />} />
      
      {/* Protected Routes */}
      <Route 
        path="/applications" 
        element={
          <PrivateRoute>
            <Applications />
          </PrivateRoute>
        }
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route 
        path="/create-team" 
        element={
          <PrivateRoute allowedRoles={['coach', 'instructor']}>
            <CreateTeam />
          </PrivateRoute>
        }
      />
      <Route 
        path="/my-team" 
        element={
          <PrivateRoute allowedRoles={['coach', 'instructor']}>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route 
        path="/settings" 
        element={
          <PrivateRoute allowedRoles={['master']}>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route path="/teams/:teamId/posts" 
        element={
          <PrivateRoute allowedRoles={['coach', 'instructor']}>
            <CreatePost />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;