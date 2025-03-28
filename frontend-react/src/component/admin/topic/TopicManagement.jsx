import React, { useEffect, useState } from "react";
import TopicChart from "./TopicChart";
import ApiService from "../../../service/apiService";
import { EditOutlined, DeleteOutlined} from "@ant-design/icons";
const ITEMS_PER_PAGE = 5; // Số chủ đề mỗi trang

const TopicManagement = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [editingTopicID, setEditingTopicID] = useState(null);
  const [editName, setEditName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTopics();
  }, []);
  const fetchTopics = async () => {
    try {
      const data = await ApiService.getTopics();
      setTopics(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách chủ đề:", error);
    }
  };

  const fetchChartData = async () => {
    try {
      const data = await ApiService.getTopicStatistics();
      return data.map((topic) => ({
        name: topic.name,
        value: topic.postCount,
      }));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thống kê:", error);
      return [];
    }
  };

  const handleAddTopic = async () => {
    if (!newTopic.trim()) return;

    try {
      await ApiService.createTopic({ name: newTopic });
      
      await fetchTopics();
      setNewTopic("");
      await fetchChartData();
      alert("Thêm chủ đề thành công!");

      // Phát sự kiện cập nhật
      window.dispatchEvent(new Event("topicUpdated"));
    } catch (error) {
      console.error("Lỗi khi thêm chủ đề:", error);
      alert("Lỗi khi thêm chủ đề. Vui lòng thử lại!");
    }
  };

  const handleEditClick = (topic) => {
    setEditingTopicID(topic.topicID);
    setEditName(topic.name);
  };

  const handleSaveEdit = async () => {
    const trimmedName = editName.trim();
    if (!trimmedName) return;

    try {
      await ApiService.updateTopic(editingTopicID, { name: trimmedName });

      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic.topicID === editingTopicID
            ? { ...topic, name: trimmedName }
            : topic
        )
      );

      setEditingTopicID(null);
      setEditName("");
      await fetchChartData();
      alert("Chủ đề đã được cập nhật thành công!");

      // Phát sự kiện cập nhật
      window.dispatchEvent(new Event("topicUpdated"));
    } catch (error) {
      alert("Lỗi khi cập nhật chủ đề. Vui lòng thử lại!");
    }
  };

  const handleDeleteTopic = async (topicID) => {
    try {
      await ApiService.deleteTopic(topicID);
      setTopics(topics.filter((topic) => topic.topicID !== topicID));
      
      await fetchChartData();
      alert("Xóa chủ đề thành công!");

      // Phát sự kiện cập nhật
      window.dispatchEvent(new Event("topicUpdated"));
    } catch (error) {
      console.error("Lỗi khi xóa chủ đề:", error);
    }
  };

  // Tính toán phân trang chỉ trong topic-manage
  const totalPages = Math.ceil(topics.length / ITEMS_PER_PAGE);
  const paginatedTopics = topics.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="topic-container">
      <div className="topic-manage">
        <h1 className="topic-title">Quản Lý Chủ Đề</h1>
        <div className="topic-input-group">
          <input
            type="text"
            placeholder="Nhập tên chủ đề"
            value={newTopic}
            className="topic-input"
            onChange={(e) => setNewTopic(e.target.value)}
          />
          <button className="topic-add-btn" onClick={handleAddTopic}>
            Thêm Chủ Đề
          </button>
        </div>

        {/* Bảng hiển thị chủ đề */}
        <div className="topic-list-section">
          <table className="topic-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Chủ Đề</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTopics.length === 0 ? (
                <tr>
                  <td colSpan="3">Không có chủ đề nào.</td>
                </tr>
              ) : (
                paginatedTopics.map((topic, index) => (
                  <tr key={topic.topicID}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>
                      {editingTopicID === topic.topicID ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        topic.name
                      )}
                    </td>
                    <td>
                      {editingTopicID === topic.topicID ? (
                        <>
                          <button
                            className="topic-save-btn"
                            onClick={handleSaveEdit}
                          >
                            Lưu
                          </button>
                          <button
                            className="topic-cancel-btn"
                            onClick={() => setEditingTopicID(null)}
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="topic-edit-btn"
                            onClick={() => handleEditClick(topic)}
                          >
                            Sửa
                          </button>
                          <button
                            className="topic-delete-btn"
                            onClick={() => handleDeleteTopic(topic.topicID)}
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/*  Phân trang */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            « Trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Tiếp »
          </button>
        </div>
      </div>

      {/*  Biểu đồ toàn bộ chủ đề */}
      <div className="topic-chart-container">
        <TopicChart fetchChartData={fetchChartData} />
      </div>
    </div>
  );
};

export default TopicManagement;
