import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/apiService";
import ConsultationModal from "../consultation/ConsultationRequestPage";

function Navbar() {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            ApiService.logout();
            navigate("/home");
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/home">Psychology Care</NavLink>
            </div>
            <ul className="navbar-ul">
                 <li><NavLink to="/home" activeclassname="active">Trang chủ</NavLink></li>
                 <li><NavLink to="/add-articles" activeclassname="active">Bài viết</NavLink></li>
                 <li><NavLink to="/contact" activeclassname="active">Liên hệ</NavLink></li>
                <li>
                    <button className="consultation-btn" onClick={() => setShowModal(true)}>
                        Đăng ký tư vấn
                    </button>
                </li>
                 {isUser && <li><NavLink to="/profile" activeclassname="active">Profile</NavLink></li>}
                 {isAdmin && <li><NavLink to="/admin" activeclassname="active">Admin</NavLink></li>}
                {!isAuthenticated &&<li><NavLink to="/login" activeclassname="active">Đăng Nhập</NavLink></li>}
                {!isAuthenticated &&<li><NavLink to="/register" activeclassname="active">Đăng Ký</NavLink></li>}
                {isAuthenticated && <li onClick={handleLogout}>Đăng xuất</li>}
            </ul>
            <ConsultationModal showModal={showModal} closeModal={() => setShowModal(false)} />
        </nav>
    );
}

export default Navbar;