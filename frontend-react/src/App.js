import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/common/navbar";
import { PsychologyCareFooter } from './component/common/footer';
import LoginPage from "./component/auth/LoginPage";
import RegisterPage from "./component/auth/RegisterPage";
import HomePage from "./component/home/HomePage";
import ProfilePage from "./component/profile/ProfilePage";
import ArticlePage from "./component/articles/ArticlePage";
import ArticleForm from "./component/articles/ArticleForm";
import ConsultationRequestPage from "./component/consultation/ConsultationRequestPage";
import AdminPage from "./component/admin/AdminPage";
import { ProtectedRoute, AdminRoute } from "./service/guard";
import ResponsiveComponent from "./component/common/ResponsiveWindow";
import ArticleDetail from "./component/articles/ArticleDetail";
import ArticleChart from "./component/admin/article/ArticleChart"
import EditArticleForm from "./component/articles/EditArticleForm";
import ConsultationList from "./component/admin/consultation/ConsultationList";
import TopicManagement from "./component/admin//topic/TopicManagement";
import CustomerManagement from "./component/admin/customer/CustomerManage";
import MyPostsPage from "./component/profile/MyPostsPage";
import MyRequestPage from "./component/profile/MyRequestPage";
import ContactPage from "./component/contact/ContactPage";


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
            <Route path="/add-article" element={<ArticleForm />} />
            <Route path="/my-requests" element={<MyRequestPage />} />
            <Route path="/my-posts" element={<MyPostsPage />} />
            <Route path="/contact" element={<ContactPage/>} />
            <Route
              path="/submit-consultation"
              element={<ConsultationRequestPage />}
            />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/editArticle/:id" element={<EditArticleForm />} />
            {/* Thêm route */}
            {/* Protected Routes */}
            <Route
              path="/profile"
              element={<ProtectedRoute element={<ProfilePage />} />}
            />
            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={<AdminRoute element={<AdminPage />} />}
            >
              <Route index element={<h2>Chào mừng đến trang Admin</h2>} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="consultations" element={<ConsultationList />} />
              <Route path="topics" element={<TopicManagement />} />
              <Route path="articles" element={<ArticleChart />} />
            </Route>
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <PsychologyCareFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
