import React, { useState, useEffect } from "react";
import ApiService from "../../service/apiService";

const ConsultationModal = ({ showModal, closeModal }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        phoneNumber: "",
        consultationDate: "",
        availableTimeSlots: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [takenSlots, setTakenSlots] = useState([]);

    useEffect(() => {
        if (showModal) {
            setLoading(true);
            ApiService.getUserProfile()
                .then(response => {
                    setFormData(prev => ({
                        ...prev,
                        fullName: response.name || "",
                        dateOfBirth: response.dateOfBirth ? response.dateOfBirth.split("T")[0] : "",
                        phoneNumber: response.phone || "",
                        consultationDate: "",
                        availableTimeSlots: "",
                        description: "",
                    }));
                })
                .catch(error => {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [showModal]);

    // Gọi API khi chọn ngày để biết slot nào đã bị đặt
    useEffect(() => {
        if (formData.consultationDate) {
            ApiService.getBookedSlots(formData.consultationDate)
                .then(slots => setTakenSlots(slots))
                .catch(err => console.error("Lỗi lấy slot đã đặt:", err));
        } else {
            setTakenSlots([]);
        }
    }, [formData.consultationDate]);

    if (!showModal) return null;

    const validateForm = () => {
        const newErrors = {};
        const name = formData.fullName.trim();
        const dateOfBirth = formData.dateOfBirth;
        const phone = formData.phoneNumber.trim();
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();

        if (!name) {
            newErrors.fullName = "Họ và tên không được để trống";
        } else if (name.length > 50) {
            newErrors.fullName = "Họ và tên tối đa 50 ký tự";
        } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(name)) {
            newErrors.fullName = "Họ và tên không được chứa số hoặc ký tự đặc biệt";
        } else if (name.split(" ").length < 2) {
            newErrors.fullName = "Họ và tên không hợp lệ";
        }

        if (!dateOfBirth) {
            newErrors.dateOfBirth = "Ngày sinh không được để trống";
        } else if (birthDate > today || age < 18 || age > 80) {
            newErrors.dateOfBirth = "Ngày sinh không hợp lệ hoặc bạn chưa đủ 18 tuổi";
        }

        if (!phone) {
            newErrors.phoneNumber = "Số điện thoại không được để trống";
        } else if (!/^0\d{9}$/.test(phone)) {
            newErrors.phoneNumber = "Số điện thoại không hợp lệ";
        }

        if (!formData.consultationDate) newErrors.consultationDate = "Vui lòng chọn ngày tư vấn!";
        if (!formData.availableTimeSlots) newErrors.availableTimeSlots = "Vui lòng chọn khung giờ tư vấn!";
        if (!formData.description) newErrors.description = "Vui lòng nhập mô tả!";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatName = (name) => {
      return name
          .normalize("NFC") // Đảm bảo chuẩn Unicode, giữ nguyên dấu tiếng Việt
          .toLowerCase() // Chuyển toàn bộ về chữ thường
          .trim()
          .split(/\s+/) // Chia thành mảng các từ, loại bỏ khoảng trắng thừa
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Viết hoa chữ cái đầu mỗi từ
          .join(" "); // Ghép lại thành chuỗi với khoảng trắng chuẩn
     };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      const finalData = {
        ...formData,
        fullName: formatName(formData.fullName), // chuẩn hóa tại đây
      };

        ApiService.submitConsultationRequest(finalData)
            .then(() => {
                alert("Đăng ký tư vấn thành công!");
                // Reset chỉ các trường user nhập, giữ nguyên dữ liệu API
                setFormData({
                    fullName: "",
                    dateOfBirth: "",
                    phoneNumber: "",
                    consultationDate: "",
                    availableTimeSlots: "",
                    description: "",
                });
                closeModal();
            })
            .catch(error => {
                const status = error.response?.status;
                const message = error.response?.data || "Đăng ký thất bại, vui lòng thử lại!";

                if (status === 409 && message.includes("Khung giờ")) {
                    alert("Khung giờ bạn chọn đã có người đăng ký. Vui lòng chọn khung giờ khác.");
                } else if (status === 401) {
                    alert("Bạn cần đăng nhập để đăng ký tư vấn!");
                } else {
                    alert(message);
                }

                console.error("Lỗi khi đăng ký tư vấn:", error);
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
                        <div className="consultation-form-group">
                            <label htmlFor="fullName" className="consultation-label">Họ và tên :</label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                        </div>

                        <div className="consultation-form-group">
                            <label htmlFor="dateOfBirth" className="consultation-label">Ngày tháng năm sinh :</label>
                            <input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                            {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth}</p>}
                        </div>

                        <div className="consultation-form-group">
                            <label htmlFor="phoneNumber" className="consultation-label">Số điện thoại :</label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                            {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
                        </div>

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

                        <div className="consultation-form-group">
                            <label htmlFor="availableTimeSlots" className="consultation-label">Khung giờ tư vấn</label>
                            <select id="availableTimeSlots" name="availableTimeSlots" value={formData.availableTimeSlots} onChange={handleChange}>
                                <option value="">Chọn khung giờ tư vấn :</option>
                                <option value="08:30 - 10:00" disabled={takenSlots.includes("08:30 - 10:00")} >
                                    08:30 - 10:00 {takenSlots.includes("08:30 - 10:00") ? "– Đã được đặt" : ""}</option>
                                <option value="10:30 - 12:00" disabled={takenSlots.includes("10:30 - 12:00")}
                                    >10:30 - 12:00 {takenSlots.includes("10:30 - 12:00") ? "– Đã được đặt" : ""}</option>
                                <option value="14:30 - 16:00" disabled={takenSlots.includes("14:30 - 16:00")}
                                    >14:30 - 16:00 {takenSlots.includes("14:30 - 16:00") ? "– Đã được đặt" : ""}</option>
                                <option value="16:30 - 18:00" disabled={takenSlots.includes("16:30 - 18:00")}
                                    >16:30 - 18:00 {takenSlots.includes("16:30 - 18:00") ? "– Đã được đặt" : ""}</option>
                                <option value="18:30 - 20:00" disabled={takenSlots.includes("18:30 - 20:00")}
                                    >18:30 - 20:00 {takenSlots.includes("18:30 - 20:00") ? "– Đã được đặt" : ""}</option>
                            </select>
                            {errors.availableTimeSlots && <p className="error-text">{errors.availableTimeSlots}</p>}
                        </div>

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

                        <button type="submit">Gửi yêu cầu</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ConsultationModal;