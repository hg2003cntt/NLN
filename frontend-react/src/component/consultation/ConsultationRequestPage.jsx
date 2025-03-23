import React, { useState, useEffect } from "react";
import ApiService from "../../service/apiService";

const ConsultationModal = ({ showModal, closeModal }) => {
    // Lưu dữ liệu từ API
    const [userInfo, setUserInfo] = useState({
        fullName: "",
        dateOfBirth: "",
        phoneNumber: "",
    });

    // Lưu dữ liệu từ form (các trường người dùng nhập)
    const [formData, setFormData] = useState({
        consultationDate: "",
        availableTimeSlots: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (showModal) {
            setLoading(true);
            ApiService.getUserProfile()
                .then(response => {
                    console.log("Dữ liệu từ API:", response);
                    setUserInfo({
                        fullName: response.name || "",
                        dateOfBirth: response.dateOfBirth ? response.dateOfBirth.split("T")[0] : "",
                        phoneNumber: response.phone || "",
                    });

                    // Reset form khi mở modal
                    setFormData({
                        consultationDate: "",
                        availableTimeSlots: "",
                        description: "",
                    });
                })
                .catch(error => {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [showModal]);

    if (!showModal) return null;

    const handleChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!formData.consultationDate) newErrors.consultationDate = "Vui lòng chọn ngày tư vấn!";
        if (!formData.availableTimeSlots) newErrors.availableTimeSlots = "Vui lòng chọn khung giờ tư vấn!";
        if (!formData.description) newErrors.description = "Vui lòng nhập mô tả!";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        ApiService.submitConsultationRequest({ ...userInfo, ...formData })
            .then(() => {
                alert("Đăng ký tư vấn thành công!");

                // Reset chỉ các trường user nhập, giữ nguyên dữ liệu API
                setFormData({
                    consultationDate: "",
                    availableTimeSlots: "",
                    description: "",
                });

                closeModal(); // Đóng modal
            })
            .catch(error => {
                console.error("Lỗi khi đăng ký tư vấn:", error);
                alert("Đăng ký thất bại, vui lòng thử lại!");
            });
    };

    // Lấy ngày hôm nay dưới dạng YYYY-MM-DD để làm giá trị `min` trong input date
    const today = new Date().toISOString().split("T")[0];

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
                        <div className="consultation-form-group">
                            <label htmlFor="fullName" className="consultation-label">Họ và tên :</label>
                            <input id="fullName" type="text" value={userInfo.fullName}/>
                        </div>

                        {/* Ngày tháng năm sinh */}
                        <div className="consultation-form-group">
                            <label htmlFor="dateOfBirth" className="consultation-label">Ngày tháng năm sinh :</label>
                            <input id="dateOfBirth" type="date" value={userInfo.dateOfBirth}/>
                        </div>

                        {/* Số điện thoại (cho phép chỉnh sửa) */}
                        <div className="consultation-form-group">
                            <label htmlFor="phoneNumber" className="consultation-label">Số điện thoại :</label>
                            <input id="phoneNumber" type="text" value={userInfo.phoneNumber} />
                        </div>

                        {/* Ngày tư vấn */}
                        <div className="consultation-form-group">
                            <label htmlFor="consultationDate" className="consultation-label">Ngày tư vấn :</label>
                            <input
                                id="consultationDate"
                                type="date"
                                name="consultationDate"
                                value={formData.consultationDate}
                                onChange={handleChange}
                                min={today} // Chỉ cho phép chọn từ hôm nay trở đi
                            />
                            {errors.consultationDate && <p className="error-text">{errors.consultationDate}</p>}
                        </div>

                        {/* Khung giờ tư vấn */}
                        <div className="consultation-form-group">
                            <label htmlFor="availableTimeSlots" className="consultation-label">Khung giờ tư vấn</label>
                            <select id="availableTimeSlots" name="availableTimeSlots" value={formData.availableTimeSlots} onChange={handleChange}>
                                <option value="">Chọn khung giờ tư vấn :</option>
                                <option value="08:30 - 10:00">08:30 - 10:00</option>
                                <option value="10:30 - 12:00">10:30 - 12:00</option>
                                <option value="14:30 - 16:00">14:30 - 16:00</option>
                                <option value="16:30 - 18:00">16:30 - 18:00</option>
                                <option value="18:30 - 20:00">18:30 - 20:00</option>
                            </select>
                            {errors.availableTimeSlots && <p className="error-text">{errors.availableTimeSlots}</p>}
                        </div>

                        {/* Mô tả vấn đề */}
                        <div className="consultation-form-group">
                            <label htmlFor="description" className="consultation-label">Mô tả vấn đề :</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Mô tả vấn đề bạn đang gặp phải..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                            {errors.description && <p className="error-text">{errors.description}</p>}
                        </div>

                        {/* Nút gửi */}
                        <button type="submit">Gửi yêu cầu</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ConsultationModal;
