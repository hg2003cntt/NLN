import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaFileAlt,
  FaSignOutAlt,
  FaNewspaper,
} from "react-icons/fa";

function AdminPage() {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h1 className="admin-title">Admin Panel</h1>
        <ul className="admin-nav">
          <li>
            <NavLink to="/admin/customers" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaUsers className="icon" /> Khách Hàng
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/consultations" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaCalendarAlt className="icon" /> Lịch Tư Vấn
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/articles" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaFileAlt className="icon" /> Bài Viết
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/topics" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaNewspaper className="icon" /> Chủ Đề Bài Viết
            </NavLink>
          </li>
          <li className="logout">
            <NavLink to="/logout" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaSignOutAlt className="icon" /> Đăng Xuất
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
