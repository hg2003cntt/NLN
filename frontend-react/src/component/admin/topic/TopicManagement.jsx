import React, { useEffect, useState } from "react";
import TopicChart from "./TopicChart";
import ApiService from "../../../service/apiService";

const TopicManagement = () => {
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState("");

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const data = await ApiService.getAllTopics();
            setTopics(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách chủ đề:", error);
        }
    };

    // 🚀 Chuyển fetchChartData từ TopicChart sang đây
    const fetchChartData = async () => {
        try {
            const data = await ApiService.getTopicStatistics();
            return data.map((topic, index) => ({
                name: topic.name,
                value: topic.postCount || 1,
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
            setTopics([...topics, { topicID: Date.now(), name: newTopic }]);
            setNewTopic("");
            await fetchChartData(); // 🔥 Cập nhật biểu đồ
        } catch (error) {
            console.error("Lỗi khi thêm chủ đề:", error);
        }
    };

    const handleDeleteTopic = async (topicID) => {
        try {
            await ApiService.deleteTopic(topicID);
            setTopics(topics.filter(topic => topic.topicID !== topicID));
            await fetchChartData(); // 🔥 Cập nhật biểu đồ
        } catch (error) {
            console.error("Lỗi khi xóa chủ đề:", error);
        }
    };

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
                            {topics.length === 0 ? (
                                <tr><td colSpan="3">Không có chủ đề nào.</td></tr>
                            ) : (
                                topics.map((topic, index) => (
                                    <tr key={topic.topicID}>
                                        <td>{index + 1}</td>
                                        <td>{topic.name}</td>
                                        <td>
                                            <button className="topic-delete-btn" onClick={() => handleDeleteTopic(topic.topicID)}>
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Truyền fetchChartData vào TopicChart */}
            <div className="topic-chart-container">
            <TopicChart fetchChartData={fetchChartData} />
            </div>
            
        </div>
    );
};

export default TopicManagement;
