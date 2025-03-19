import React, { useState } from "react";

const ConsultationFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    fullName: "",
    phoneNumber: "",
    status: "",
    consultationDate: "", // Thêm trường ngày tư vấn
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    console.log("Bộ lọc áp dụng:", filters); // Kiểm tra dữ liệu bộ lọc
    onFilterChange(filters);
  };

  const removeFilters = () => {
    setFilters({ fullName: "", phoneNumber: "", status: "", consultationDate: "" }); // Reset tất cả bộ lọc
    onFilterChange({ fullName: "", phoneNumber: "", status: "", consultationDate: "" });
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
      {/* Thêm chọn ngày tư vấn */}
      <input
        type="date"
        name="consultationDate"
        value={filters.consultationDate}
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
