import React, { useEffect, useState } from "react";
import ApiService from "../../service/apiService";

const ConsultationList = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await ApiService.getAllConsultationRequests();
        setConsultations(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách lịch tư vấn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ApiService.updateConsultationStatus(id, newStatus);
      setConsultations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Danh sách lịch tư vấn</h1>

      {loading ? (
        <p className="loading">Đang tải...</p>
      ) : consultations.length === 0 ? (
        <p className="no-data">Không có lịch tư vấn nào.</p>
      ) : (
        <div className="table-container">
          <table className="consultation-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>ID người dùng</th>
                <th>Tên khách hàng</th>
                <th>Số điện thoại</th>
                <th>Ngày sinh</th>
                <th>Khung giờ tư vấn</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.userId}</td>
                  <td>{item.fullName}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.dateOfBirth}</td>
                  <td>{item.availableTimeSlots}</td>
                  <td>
                    <select
                      className="status-dropdown"
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    >
                      <option value="Chưa liên hệ">Chưa liên hệ</option>
                      <option value="Đã liên hệ">Đã liên hệ</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Hủy bỏ">Hủy bỏ</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultationList;
