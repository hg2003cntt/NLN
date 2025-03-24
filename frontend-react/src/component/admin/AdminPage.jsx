import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import ApiService from "../../service/apiService";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUsers, FaCalendarAlt, FaFileAlt, FaNewspaper, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";

function AdminPage() {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      ApiService.logout();
      navigate("/home");
    }
  };
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h1 className="admin-title">Trang quản trị</h1>
        <ul className="admin-nav">
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUserCircle className="icon" /> Thông tin cá nhân
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/customers"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUsers className="icon" /> Khách Hàng
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/consultations"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaCalendarAlt className="icon" /> Lịch Tư Vấn
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/articles"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaFileAlt className="icon" /> Bài Viết
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/topics"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaNewspaper className="icon" /> Chủ Đề Bài Viết
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reports"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaExclamationTriangle className="icon" /> Báo Cáo Vi Phạm
            </NavLink>
          </li>
          <li onClick={handleLogout}>
          <NavLink>
            <FaSignOutAlt className="icon" /> Đăng xuất
             </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main Content - Hiển thị nội dung trang con */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPage;
