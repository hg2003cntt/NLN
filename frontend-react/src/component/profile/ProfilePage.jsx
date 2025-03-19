import React, { useEffect, useState } from "react";
import ApiService from "../../service/apiService";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Modal from "react-modal"; // Import modal

Modal.setAppElement("#root"); // Cấu hình modal

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [phone, setPhone] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfile = await ApiService.getUserProfile();
                userProfile.dateOfBirth = dayjs(userProfile.dateOfBirth).format("DD/MM/YYYY");
                setUser(userProfile);
                setPhone(userProfile.phone);
            } catch (error) {
                console.error("Lỗi khi lấy hồ sơ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const validatePhone = (phone) => /^0\d{9}$/.test(phone);

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn một tệp ảnh hợp lệ!");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                await ApiService.uploadUserAvatar({ avatar: reader.result });
                setUser((prev) => ({ ...prev, avatar: reader.result }));
                alert("Cập nhật ảnh đại diện thành công!");
            } catch (error) {
                alert("Lỗi khi cập nhật ảnh đại diện!");
            }
        };
    };

    const handleUpdateProfile = async () => {
        if (!validatePhone(phone)) {
            setError("Số điện thoại không hợp lệ hãy thử lại !");
            return;
        }
        setError("");

        try {
            await ApiService.updateUserProfile({ phone });
            alert("Cập nhật thành công !");
            setIsEditing(false);
        } catch (error) {
            alert("Lỗi khi cập nhật !");
        }
    };

    const validatePassword = (oldPass, newPass, confirmPass) => {
        if (!newPass) return "Mật khẩu không được để trống!";
        if (newPass.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự!";
        if (!/[A-Z]/.test(newPass)) return "Mật khẩu phải có ít nhất một chữ hoa!";
        if (!/[a-z]/.test(newPass)) return "Mật khẩu phải có ít nhất một chữ thường!";
        if (!/\d/.test(newPass)) return "Mật khẩu phải có ít nhất một số!";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPass)) return "Mật khẩu phải có ít nhất một ký tự đặc biệt!";
        if (newPass === oldPass) return "Mật khẩu mới không được giống mật khẩu cũ!";
        if (newPass !== confirmPass) return "Xác nhận mật khẩu không khớp!";
        return "";
    };

    const handleChangePassword = async () => {
        const errorMsg = validatePassword(oldPassword, newPassword, confirmPassword);
        if (errorMsg) {
            setPasswordError(errorMsg);
            return;
        }
        setPasswordError("");

        try {
            // Gửi yêu cầu để thay đổi mật khẩu
            await ApiService.updateUserPassword({ oldPassword, newPassword });
            alert("Cập nhật mật khẩu thành công!");
            setIsModalOpen(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            // Kiểm tra nếu là lỗi do mật khẩu cũ sai
            if (error.response && error.response.data === "Mật khẩu cũ không chính xác!") {
                setPasswordError("Mật khẩu cũ không chính xác! Hãy thử lại.");
            } else {
                setPasswordError("Lỗi khi cập nhật mật khẩu!");
            }
        }
    };



    if (loading) return <div className="loading-screen">Đang tải dữ liệu...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-avatar-section">
                    <img src={user.avatar || "/default-avatar.png"} alt="Avatar" className="profile-avatar" />
                    <label className="upload-btn">Thêm ảnh đại diện <input type="file" onChange={handleAvatarChange} accept="image/*" /> </label>

                    <Link to="/my-requests" className="btn request-btn">Xem yêu cầu tư vấn </Link>
                    <Link to="/my-posts" className="btn my-posts-btn">Bài viết của tôi</Link>

                </div>

                <div className="profile-info">
                    <h2 className="profile-title">Hồ sơ cá nhân</h2>
                    <div className="profile-form">
                        <label><strong>Tên đăng nhập:</strong></label>
                        <input type="text" value={user.username} disabled />
                        <label><strong>Họ và tên:</strong></label>
                        <input type="text" value={user.name} disabled />
                        <label><strong>Ngày sinh:</strong></label>
                        <input type="text" value={user.dateOfBirth} disabled />
                        <label><strong>Email:</strong></label>
                        <input type="text" value={user.email} disabled />
                        <label><strong>Số điện thoại:</strong></label>
                        {isEditing ? (
                            <>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                {error && <p className="error-message">{error}</p>}
                                <button className="update-btn" onClick={handleUpdateProfile}>Lưu</button>
                                <button className="cancel-btn" onClick={() => { setIsEditing(false); setPhone(user.phone); }}>Hủy</button>
                            </>
                        ) : (
                            <>
                                <input type="text" value={phone} disabled />
                                <button className="edit-btn" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
                            </>
                        )}
                    </div>

                    <button className="edit-btn" onClick={() => setIsModalOpen(true)}>Đổi mật khẩu</button>

                    {/* Modal */}
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        className="modal-content modal-change-password"
                        overlayClassName="modal-overlay"
                    >
                        <h3>Đổi Mật Khẩu</h3>
                        <input
                            type="password"
                            placeholder="Mật khẩu cũ"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>} {/* Hiển thị lỗi */}
                        <button className="update-btn" onClick={handleChangePassword}>Lưu</button>
                        <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Hủy</button>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
