import React, { useEffect, useState } from "react";
import ApiService from "../../../service/apiService";
import ConsultationFilter from "./ConsultationFilter"; // Cập nhật import

const ConsultationList = () => {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await ApiService.getAllConsultationRequests();
        setConsultations(data);
        setFilteredConsultations(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách lịch tư vấn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleFilterChange = (filters) => {
    const filteredData = consultations.filter((item) => {
      return (
        (filters.fullName
          ? item.fullName.toLowerCase().includes(filters.fullName.toLowerCase())
          : true) &&
        (filters.phoneNumber
          ? item.phoneNumber.includes(filters.phoneNumber)
          : true) &&
        (filters.status ? item.status === filters.status : true)
      );
    });
    setFilteredConsultations(filteredData);
  };

  return (
    <div className="consultation-container">
      <div className="content">
        <h1 className="title">Danh sách lịch tư vấn</h1>
  
        {loading ? (
          <p className="loading">Đang tải...</p>
        ) : filteredConsultations.length === 0 ? (
          <>
            <p style={{fontSize: "18px"}} className="no-data">Không có lịch tư vấn nào.</p>
            <div className="filter">
              <ConsultationFilter onFilterChange={handleFilterChange} />
            </div>
          </>
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
                {filteredConsultations.map((item, index) => (
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
                        onChange={(e) => console.log(`Đổi trạng thái ${e.target.value}`)}
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
  
      {/* Bộ lọc vẫn hiển thị khi có dữ liệu */}
      {filteredConsultations.length > 0 && (
        <div className="filter">
          <ConsultationFilter onFilterChange={handleFilterChange} />
        </div>
      )}
    </div>
  );  
}
export default ConsultationList;
