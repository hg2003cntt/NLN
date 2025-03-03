import React, { useState } from "react";
import ApiService from "../../service/apiService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    dateOfBirth: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    const { username, password, confirmPassword, name, dateOfBirth, email, phone } = formData;
    const currentYear = new Date().getFullYear();
    const birthYear = dateOfBirth ? new Date(dateOfBirth).getFullYear() : 0;

    // Kiểm tra Tên đăng nhập
    if (!username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    } else if (username.length < 5) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 5 ký tự";
    } else if (username.length > 20) {
      newErrors.username = "Tên đăng nhập tối đa 20 ký tự";
    } else if (!/^[a-z0-9]+$/.test(username)) {
      newErrors.username = "Tên đăng nhập chỉ được chứa chữ thường và số";
    } else if (/^\d+$/.test(username)) {
      newErrors.username = "Tên đăng nhập không thể chỉ chứa số";
    } else if ((username.match(/[a-zA-Z]/g) || []).length < 2) {
      newErrors.username = "Tên đăng nhập phải chứa ít nhất 2 chữ cái";
    }

    // Kiểm tra Họ và Tên
    if (!name.trim()) {
      newErrors.name = "Họ và tên không được để trống";
    } else if (name.length > 50) {
      newErrors.name = "Họ và tên tối đa 50 ký tự";
    } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(name)) {
      newErrors.name = "Họ và tên không được chứa số hoặc ký tự đặc biệt";
    } else if (name.split(" ").length < 2) {
      newErrors.name = "Họ và tên không hợp lệ";
    }

    // Kiểm tra Ngày sinh
    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh không được để trống";
    } else if (birthYear > currentYear) {
      newErrors.dateOfBirth = "Ngày sinh không hợp lệ";
    } else if (currentYear - birthYear < 18) {
      newErrors.dateOfBirth = "Bạn phải đủ 18 tuổi trở lên";
    } else if (currentYear - birthYear > 80) {
      newErrors.dateOfBirth = "Ngày sinh không hợp lệ";
    }

    // Kiểm tra Mật khẩu
    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Mật khẩu phải có ít nhất một chữ hoa";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Mật khẩu phải có ít nhất một chữ thường";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Mật khẩu phải có ít nhất một số";
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = "Mật khẩu phải có ít nhất một ký tự đặc biệt";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    // Kiểm tra Email
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Kiểm tra Số điện thoại
    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^0\d{9}$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

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
      let value = e.target.value;
        const fieldName = e.target.name;

        if (fieldName === "username") {
            value = value.toLowerCase().replace(/\s+/g, ""); // Không khoảng trắng trong username
        } else if (fieldName === "name") {
            value = formatName(value); // Chuẩn hóa họ và tên trước khi lưu
        }

        setFormData({ ...formData, [fieldName]: value });
    };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await ApiService.registerUser(formData);
      alert("Đăng ký thành công!");
      console.log(response);
    } catch (error) {
      alert(error.message || "Lỗi đăng ký");
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <h2 className="register__title">Đăng ký</h2>
        <form className="register__form" onSubmit={handleSubmit}>
          <input className="register__input" type="text" name="username" placeholder="Tên đăng nhập" onChange={handleChange} />
          {errors.username && <p className="register__error">{errors.username}</p>}

          <input className="register__input" type="text" name="name" placeholder="Họ và tên" onChange={handleChange} />
          {errors.name && <p className="register__error">{errors.name}</p>}

          <input className="register__input" type="date" name="dateOfBirth" onChange={handleChange} />
          {errors.dateOfBirth && <p className="register__error">{errors.dateOfBirth}</p>}

          <input className="register__input" type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} />
          {errors.password && <p className="register__error">{errors.password}</p>}

          <input className="register__input" type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" onChange={handleChange} />
          {errors.confirmPassword && <p className="register__error">{errors.confirmPassword}</p>}

          <input className="register__input" type="email" name="email" placeholder="Email" onChange={handleChange} />
          {errors.email && <p className="register__error">{errors.email}</p>}

          <input className="register__input" type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} />
          {errors.phone && <p className="register__error">{errors.phone}</p>}

          <button className="register__button" type="submit">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
