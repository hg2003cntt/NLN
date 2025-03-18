import React, { useState } from "react";

const ConsultationFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    fullName: "",
    phoneNumber: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const removeFilters = () => {
    setFilters({ fullName: "", phoneNumber: "", status: "" }); // Đặt lại state
    onFilterChange({ fullName: "", phoneNumber: "", status: "" }); // Cập nhật danh sách
  };
  

  return (
    <div className="filter-container">
      <h2>Lọc lịch tư vấn</h2>
      <input
        type="text"
        name="fullName"
        placeholder="Tên khách hàng"
        value={filters.fullName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="Số điện thoại"
        value={filters.phoneNumber}
        onChange={handleChange}
      />
      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="">Tất cả trạng thái</option>
        <option value="Chưa liên hệ">Chưa liên hệ</option>
        <option value="Đã liên hệ">Đã liên hệ</option>
        <option value="Hoàn thành">Hoàn thành</option>
        <option value="Hủy bỏ">Hủy bỏ</option>
      </select>
      <button onClick={applyFilters}>Lọc</button>
      <button onClick={removeFilters}>Xóa Bộ Lọc</button>
    </div>
  );
};

export default ConsultationFilter;
