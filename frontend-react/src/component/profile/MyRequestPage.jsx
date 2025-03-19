import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Dùng Link
import ApiService from "../../service/apiService";
import dayjs from "dayjs";
import { MdArrowBack } from "react-icons/md"; // Icon Google

const MyRequestPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState(null); // Trạng thái thẻ mở rộng

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await ApiService.getUserConsultations();
                setRequests(response);
            } catch (err) {
                setError("Không thể tải danh sách");
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) return <p className="loading">Đang tải...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="request-page">
            <h2 className="title">Danh sách yêu cầu tư vấn</h2>

            {/* Thông báo khi không có yêu cầu tư vấn */}
            {requests.length === 0 ? (
                <div className="no-requests">
                    <p>Hiện tại bạn chưa có yêu cầu tư vấn nào.</p>
                    <p>Vui lòng đặt lịch để nhận tư vấn sớm nhất !</p>
                </div>
            ) : (
                <div className="request-list">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className={`request-card ${expandedId === request.id ? "expanded" : ""}`}
                            onClick={() => toggleExpand(request.id)}
                        >
                            <h3 className="request-date">{dayjs(request.consultationDate).format("DD/MM/YYYY")}</h3>
                            <p><strong>Khung giờ tư vấn:</strong> {request.availableTimeSlots}</p>
                            <p><strong>Họ và tên:</strong> {request.fullName}</p>
                            <p><strong>Ngày sinh:</strong> {dayjs(request.dateOfBirth).format("DD/MM/YYYY")}</p>
                            <p><strong>Số điện thoại:</strong> {request.phoneNumber}</p>
                            <p><strong>Mô tả vấn đề:</strong> {request.description || "Không có mô tả"}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Nút quay lại nằm ngay dưới danh sách */}
            <div className="back-container">
                <Link to="/profile" className="back-btn"> <MdArrowBack size={20} /> Quay lại </Link>
            </div>
        </div>
    );
};

export default MyRequestPage;
