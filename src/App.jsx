import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import HackathonListingPage from './components/pages/HackathonListingPage';
import HackathonDetailPage from './components/pages/HackathonDetailPage';
import RegistrationPage from './components/pages/RegistrationPage';
import DashboardPage from './components/pages/DashboardPage';
import FaqPage from './components/pages/FaqPage';
import NotFoundPage from './components/pages/NotFoundPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AIAssistant from './components/ai/AIAssistant';
import { getCurrentUser } from './features/auth/authActions';

// Organizer redirect component
const OrganizerRedirect = () => {
  useEffect(() => {
    localStorage.setItem('preSelectedUserType', 'organizer');
  }, []);
  return <Navigate to="/register" replace />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Try to get current user data
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/hackathons" element={<HackathonListingPage />} />
              <Route path="/hackathons/:id" element={<HackathonDetailPage />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route path="/organize" element={<OrganizerRedirect />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <AIAssistant />
        </div>
      </Router>
  );
}

export default App;
