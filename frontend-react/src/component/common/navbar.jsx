import React, { useState }  from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ApiService from '../../service/apiService';
import ConsultationModal from '../consultation/ConsultationRequestPage';

function Navbar() {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false); // State to control modal visibility


    const handleLogout = () => {
        const isLogout = window.confirm('Are you sure you want to logout this user?');
        if (isLogout) {
            ApiService.logout();
            navigate('/home');
        }
    };

    const openModal = () => {
        setShowModal(true); // Open modal
    };

    const closeModal = () => {
        setShowModal(false); // Close modal
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/home">Psychology Care</NavLink>
            </div>
            <ul className="navbar-ul">
                <li><NavLink to="/home" activeclassname="active">Trang chủ</NavLink></li>
                <li><NavLink to="/rooms" activeclassname="active">Bài viết</NavLink></li>
                <li><NavLink to="/contact" activeclassname="active">Liên hệ</NavLink></li>
                <li><NavLink to="/submit-consultation" activeclassname="active" onClick={openModal} >
                    Consultation Registration
                </NavLink></li>

                {isUser && <li><NavLink to="/profile" activeclassname="active">Profile</NavLink></li>}
                {isAdmin && <li><NavLink to="/admin" activeclassname="active">Admin</NavLink></li>}

                {!isAuthenticated &&<li><NavLink to="/login" activeclassname="active">Login</NavLink></li>}
                {!isAuthenticated &&<li><NavLink to="/register" activeclassname="active">Register</NavLink></li>}
                {isAuthenticated && <li onClick={handleLogout}>Logout</li>}
            </ul>
            <ConsultationModal showModal={showModal} closeModal={closeModal} />
        </nav>
    );
}

export default Navbar;