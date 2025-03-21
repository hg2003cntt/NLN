import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/apiService";
import ConsultationModal from "../consultation/ConsultationRequestPage";

function Navbar() {
  const isAuthenticated = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();
  const isUser = ApiService.isUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      ApiService.logout();
      navigate("/home");
    }
  };

  useEffect(() => {
    // Lấy danh sách chủ đề từ API
    async function fetchTopics() {
      try {
        const data = await ApiService.getTopics();
        setTopics(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chủ đề:", error);
      }
    }
    fetchTopics();

    // Lắng nghe sự kiện cập nhật từ TopicManagement
    const handleTopicUpdate = () => {
      fetchTopics();
    };

    window.addEventListener("topicUpdated", handleTopicUpdate);

    return () => {
      window.removeEventListener("topicUpdated", handleTopicUpdate);
    };
  }, []);

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

      {/* Thanh tìm kiếm & Dropdown danh mục */}
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
      </div>

      <ul className="navbar-ul">
        <li>
          <NavLink to="/home">Trang chủ</NavLink>
        </li>
        <li>
          <NavLink to="/articles">Bài viết</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Liên hệ</NavLink>
        </li>
        <li>
          <button
            className="consultation-btn"
            onClick={() => setShowModal(true)}
          >
            Đăng ký tư vấn
          </button>
        </li>
        {isUser && (
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
        )}
        {isAdmin && (
          <li>
            <NavLink to="/admin">Admin</NavLink>
          </li>
        )}
        {!isAuthenticated && (
          <li>
            <NavLink to="/login">Đăng Nhập</NavLink>
          </li>
        )}
        {!isAuthenticated && (
          <li>
            <NavLink to="/register">Đăng Ký</NavLink>
          </li>
        )}
        {isAuthenticated && <li onClick={handleLogout}>Đăng xuất</li>}
      </ul>

      <ConsultationModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
      />
    </nav>
  );
}

export default Navbar;
