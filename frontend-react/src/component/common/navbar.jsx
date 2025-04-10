import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/apiService";
import ConsultationModal from "../consultation/ConsultationRequestPage";
import { FaBell } from "react-icons/fa"; // Import icon thông báo

function Navbar() {
  const isAuthenticated = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();
  const isUser = ApiService.isUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Thêm state lưu danh sách thông báo
  const [notifications, setNotifications] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false); // Modal thông báo

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      ApiService.logout();
      navigate("/home");
    }
  };
  useEffect(() => {
    const handleOpenModal = () => setShowModal(true);
    window.addEventListener("openConsultationModal", handleOpenModal);

    return () => {
        window.removeEventListener("openConsultationModal", handleOpenModal);
    };
}, []);


  useEffect(() => {
    async function fetchTopics() {
      try {
        const data = await ApiService.getTopics();
        setTopics(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chủ đề:", error);
      }
    }
    fetchTopics();

    const handleTopicUpdate = () => {
      fetchTopics();
    };
    window.addEventListener("topicUpdated", handleTopicUpdate);

    return () => {
      window.removeEventListener("topicUpdated", handleTopicUpdate);
    };
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await ApiService.getNotificationsUnread();
        console.log("Thông báo nhận được:", response);
  
        // Kiểm tra định dạng dữ liệu
        if (Array.isArray(response)) {
          setNotifications(response);
        } else {
          console.error("Dữ liệu thông báo không đúng định dạng:", response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
      }
    }
  
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleNotificationClick = async (notification) => {
    try {
        await ApiService.markNotificationAsRead(notification.id);
        
        if (notification.postId) {
            let link = `/article/${notification.postId}`;
            if (notification.commentId) {
                link += `#comment-${notification.commentId}`;
            }
            navigate(link);
        } else {
            navigate("/home");
        }

        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (error) {
        console.error("Lỗi khi đánh dấu thông báo đã đọc:", error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedTopic) params.append("topic", selectedTopic);
    if (searchKeyword) params.append("search", searchKeyword);

    navigate(`/articles?${params.toString()}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/home">Psychology Care</NavLink>
      </div>

      <div className="search-bar">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">Chọn danh mục</option>
          {topics.map((topic) => (
            <option key={topic.topicID} value={topic.topicID}>
              {topic.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
        <ul></ul>
      </div>

      <ul className="navbar-ul">
        <li><NavLink to="/home">Trang chủ</NavLink></li>
        <li><NavLink to="/articles">Bài viết</NavLink></li>
        <li><NavLink to="/contact">Liên hệ</NavLink></li>
        <li>
          <button className="consultation-btn" onClick={() => setShowModal(true)}>
            Đăng ký tư vấn
          </button>
        </li>
        {isUser && <li><NavLink to="/profile">Profile</NavLink></li>}
        {isAdmin && <li><NavLink to="/admin">Admin</NavLink></li>}
        {!isAuthenticated && <li><NavLink to="/login">Đăng Nhập</NavLink></li>}
        {!isAuthenticated && <li><NavLink to="/register">Đăng Ký</NavLink></li>}

        {isAuthenticated && (
          <li>
            <button onClick={() => setShowNotificationModal(true)} className="relative p-2">
              <FaBell size={24} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  {notifications.length}
                </span>
              )}
            </button>
          </li>
        )}

        {isAuthenticated && <li onClick={handleLogout}>Đăng xuất</li>}
      </ul>

      <ConsultationModal showModal={showModal} closeModal={() => setShowModal(false)} />

      {showNotificationModal && (
      <div className="modal-overlay" onClick={() => setShowNotificationModal(false)}>
        <div className="modal-content">
          <button className="close-btn" onClick={() => setShowNotificationModal(false)}>X</button>
          <h3>Thông báo</h3>
          {notifications.length === 0 ? (
            <p>Không có thông báo nào</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification)} 
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  {notification.message || "Thông báo không có nội dung"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )}
    </nav>
  );
}

export default Navbar;
