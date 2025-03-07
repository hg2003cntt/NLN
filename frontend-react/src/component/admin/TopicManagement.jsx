import React, { useEffect, useState } from "react";
import ApiService from "../../service/apiService";

const TopicManagement = () => {
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState("");

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const data = await ApiService.getTopics();
            setTopics(data);
        } catch (error) {
            console.error("Lỗi khi tải chủ đề:", error);
        }
    };

    const handleAddTopic = async () => {
        if (!newTopic.trim()) return;
        try {
          console.log(newTopic);
            await ApiService.createTopic({name:newTopic});
            setNewTopic("");
            fetchTopics();
        } catch (error) {
            console.error("Lỗi khi thêm chủ đề:", error);
        }
    };

    const handleDeleteTopic = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa chủ đề này?")) {
            try {
                await ApiService.deleteTopic(id);
                fetchTopics();
            } catch (error) {
                console.error("Lỗi khi xóa chủ đề:", error);
            }
        }
    };

    return (
        <div className="topic-container">
            <h1 className="topic-title">Quản Lý Chủ Đề</h1>

            <div className="topic-input-group">
                <input
                    type="text"
                    placeholder="Nhập tên chủ đề"
                    value={newTopic}
                    className="topic-input"
                    onChange={(e) => setNewTopic(e.target.value)}
                />
                <button className="topic-add-btn" onClick={handleAddTopic}>Thêm Chủ Đề</button>
            </div>

            <table className="topic-table">
                <thead>
                    <tr>
                        <th style={{ width: "10%" }}>STT</th>
                        <th style={{ width: "60%" }}>Tên Chủ Đề</th>
                        <th style={{ width: "30%" }}>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.length === 0 ? (
                        <tr>
                            <td colSpan="3">Không có chủ đề nào.</td>
                        </tr>
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
    );
};

export default TopicManagement;
