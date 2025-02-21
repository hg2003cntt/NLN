import React, { useState, useEffect } from "react";
import ApiService from "../../service/apiService";

const ConsultationModal = ({ showModal, closeModal }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        phoneNumber: "",
        city: "",
        service: "",
        availableTimeSlots: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (showModal) {
            ApiService.getUserInfo()
                .then(response => {
                    setFormData(prevData => ({
                        ...prevData,
                        fullName: response.fullName,
                        dateOfBirth: response.dateOfBirth,
                        phoneNumber: response.phoneNumber,
                        city: response.city,
                    }));
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching user info:", error);
                    setLoading(false);
                });
        }
    }, [showModal]);

    if (!showModal) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.service) newErrors.service = "Vui lòng chọn dịch vụ tư vấn!";
        if (!formData.availableTimeSlots) newErrors.availableTimeSlots = "Vui lòng chọn khung giờ tư vấn!";
        if (!formData.description) newErrors.description = "Vui lòng nhập mô tả!";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        ApiService.submitConsultationRequest(formData)
            .then(() => {
                alert("Đăng ký tư vấn thành công!");
                closeModal();
            })
            .catch(error => {
                console.error("Lỗi khi đăng ký tư vấn:", error);
                alert("Đăng ký thất bại, vui lòng thử lại!");
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={closeModal}>X</button>
                <h2>Đăng ký tư vấn</h2>

                {loading ? (
                    <p>Đang tải thông tin...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Họ và tên */}
                        <label htmlFor="fullName">Họ và tên</label>
                        <input id="fullName" type="text" name="fullName" value={formData.fullName} disabled />

                        {/* Ngày tháng năm sinh */}
                        <label htmlFor="dateOfBirth">Ngày tháng năm sinh</label>
                        <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} disabled />

                        {/* Số điện thoại */}
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                        <input id="phoneNumber" type="text" name="phoneNumber" value={formData.phoneNumber} disabled />

                        {/* Thành phố */}
                        <label htmlFor="city">Thành phố</label>
                        <input id="city" type="text" name="city" value={formData.city} disabled />

                        {/* Dịch vụ tư vấn */}
                        <label htmlFor="service">Dịch vụ tư vấn</label>
                        <select id="service" name="service" value={formData.service} onChange={handleChange}>
                            <option value="">Chọn dịch vụ tư vấn</option>
                            <option value="Stress Management">Quản lý căng thẳng</option>
                            <option value="Anxiety Treatment">Điều trị lo âu</option>
                            <option value="Depression Counseling">Tư vấn trầm cảm</option>
                        </select>
                        {errors.service && <p className="error">{errors.service}</p>}

                        {/* Khung giờ tư vấn */}
                        <label htmlFor="availableTimeSlots">Khung giờ tư vấn</label>
                        <select id="availableTimeSlots" name="availableTimeSlots" value={formData.availableTimeSlots} onChange={handleChange}>
                            <option value="">Chọn khung giờ tư vấn</option>
                            <option value="09:00 - 10:00">09:00 - 10:00</option>
                            <option value="10:00 - 11:00">10:00 - 11:00</option>
                            <option value="14:00 - 15:00">14:00 - 15:00</option>
                        </select>
                        {errors.availableTimeSlots && <p className="error">{errors.availableTimeSlots}</p>}

                        {/* Mô tả vấn đề */}
                        <label htmlFor="description">Mô tả vấn đề</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Mô tả vấn đề bạn đang gặp phải..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && <p className="error">{errors.description}</p>}

                        {/* Nút gửi */}
                        <button type="submit">Gửi yêu cầu</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ConsultationModal;
