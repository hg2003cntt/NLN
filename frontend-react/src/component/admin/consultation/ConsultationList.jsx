import React, { useEffect, useState } from "react";
import ApiService from "../../../service/apiService";
import ConsultationFilter from "./ConsultationFilter";

const ConsultationList = () => {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 8; // Số dòng trên mỗi trang

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
        (filters.status ? item.status === filters.status : true) &&
        (filters.consultationDate
          ? item.consultationDate === filters.consultationDate
          : true)
      );
    });
    setFilteredConsultations(filteredData);
    setCurrentPage(0); // Reset trang khi lọc
  };

  const handleStatusChange = async (id, newStatus) => {
    let cancelReason = null;

    if (newStatus === "Hủy bỏ") {
      cancelReason = prompt("Nhập lý do hủy bỏ:");
      if (!cancelReason) {
        alert("Bạn phải nhập lý do để hủy bỏ.");
        return; // Dừng nếu không có lý do
      }
    }

    try {
      await ApiService.updateConsultationStatus(id, newStatus, cancelReason);
      setConsultations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus, cancelReason } : c
        )
      );
      setFilteredConsultations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus, cancelReason } : c
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái thất bại!");
    }
};


  // Lấy dữ liệu của trang hiện tại
  const paginatedConsultations = filteredConsultations.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="consultation-container">
      <div className="content">
        <h1 className="title">Danh sách lịch tư vấn</h1>

        {loading ? (
          <p className="loading">Đang tải...</p>
        ) : (
          <>
            <div className="table-container">
              <table className="consultation-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>ID người dùng</th>
                    <th>Tên khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Ngày sinh</th>
                    <th>Ngày tư vấn</th>
                    <th>Khung giờ tư vấn</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedConsultations.length > 0 ? (
                    paginatedConsultations.map((item, index) => (
                      <tr key={item.id}>
                        <td>{currentPage * pageSize + index + 1}</td>
                        <td>{item.userId}</td>
                        <td>{item.fullName}</td>
                        <td>{item.phoneNumber}</td>
                        <td>{item.dateOfBirth}</td>
                        <td>{item.consultationDate}</td>
                        <td>{item.availableTimeSlots}</td>
                        <td>
                          <select
                            className="status-dropdown"
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(item.id, e.target.value)
                            }
                          >
                            <option value="Chưa liên hệ">Chưa liên hệ</option>
                            <option value="Đã liên hệ">Đã liên hệ</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                            <option value="Hủy bỏ">Hủy bỏ</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="empty-row">
                      <td colSpan="8">Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                {"<"} Trước
              </button>
              <span>
                Trang {currentPage + 1} /{" "}
                {Math.ceil(filteredConsultations.length / pageSize)}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev <
                    Math.ceil(filteredConsultations.length / pageSize) - 1
                      ? prev + 1
                      : prev
                  )
                }
                disabled={
                  currentPage >=
                  Math.ceil(filteredConsultations.length / pageSize) - 1
                }
              >
                Sau {">"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bộ lọc */}
      <div className="filter">
        <ConsultationFilter onFilterChange={handleFilterChange} />
      </div>
    </div>
  );
};

export default ConsultationList;
