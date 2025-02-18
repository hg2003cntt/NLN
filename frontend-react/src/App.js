import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/common/navbar';
import Footer from './component/common/footer';
import LoginPage from './component/auth/LoginPage';
import RegisterPage from './component/auth/RegisterPage';
import HomePage from './component/home/HomePage';
import ProfilePage from './component/profile/ProfilePage';
import ArticlePage from './component/articles/ArticlePage';
import ConsultationRequestPage from './component/consultation/ConsultationRequestPage';
import AdminPage from './component/admin/AdminPage';
import { ProtectedRoute, AdminRoute } from './service/guard';
import ResponsiveComponent from './component/common/ResponsiveWindow';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<><HomePage />
                                          <ResponsiveComponent /></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/articles" element={<ArticlePage />} />
            <Route path="/submit-consultation" element={<ConsultationRequestPage />} />

            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute element={<AdminPage />} />} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
