import React from "react";
import { NavLink } from "react-router-dom";
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
            <NavLink to="/admin/customers" activeClassName="active">
              <FaUsers className="icon" /> Khách Hàng
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/consultations" activeClassName="active">
              <FaCalendarAlt className="icon" /> Lịch Tư Vấn
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/articles" activeClassName="active">
              <FaFileAlt className="icon" /> Bài Viết
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/topics" activeClassName="active">
              <FaNewspaper className="icon" /> Chủ Đề Bài Viết
            </NavLink>
          </li>
          <li className="logout">
            <NavLink to="/logout">
              <FaSignOutAlt className="icon" /> Đăng Xuất
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <h1>Admin Dashboard</h1>
        <p>Nội dung sẽ hiển thị ở đây.</p>
      </main>
    </div>
  );
}

export default AdminPage;
