import React, { useState } from "react";
import ApiService from "../../service/apiService";
import { useNavigate, useLocation } from "react-router-dom";

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

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/login";

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    const { username, password, confirmPassword, name, dateOfBirth, email, phone } = formData;
    const currentYear = new Date().getFullYear();
    const birthYear = dateOfBirth ? new Date(dateOfBirth).getFullYear() : 0;

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

    if (!name.trim()) {
      newErrors.name = "Họ và tên không được để trống";
    } else if (name.length > 50) {
      newErrors.name = "Họ và tên tối đa 50 ký tự";
    } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(name)) {
      newErrors.name = "Họ và tên không được chứa số hoặc ký tự đặc biệt";
    } else if (name.split(" ").length < 2) {
      newErrors.name = "Họ và tên không hợp lệ";
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh không được để trống";
    } else if (birthYear > currentYear) {
      newErrors.dateOfBirth = "Ngày sinh không hợp lệ";
    } else if (currentYear - birthYear < 18) {
      newErrors.dateOfBirth = "Bạn phải đủ 18 tuổi trở lên";
    } else if (currentYear - birthYear > 80) {
      newErrors.dateOfBirth = "Ngày sinh không hợp lệ";
    }

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

    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

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
      .normalize("NFC")
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleChange = (e) => {
    let value = e.target.value;
    const fieldName = e.target.name;

    if (fieldName === "username") {
      value = value.toLowerCase().replace(/\s+/g, "");
    } else if (fieldName === "name") {
      value = formatName(value);
    }

    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await ApiService.registerUser(formData);
      if (response) {
        navigate(from, { replace: true });
        alert("Đăng ký thành công!");
      }
    } catch (error) {
      alert(error.message || "Đăng ký thất bại. Vui lòng thử lại!");
    }
  };

  return (
      <main>
        <div className="register">
          <div className="register__container">
            <h2 className="register__title">Đăng ký</h2>
            <form className="register__form" onSubmit={handleSubmit}>
              <input type="text" name="username" placeholder="Tên đăng nhập" onChange={handleChange} className="register__input" />
              {errors.username && <p className="register__error">{errors.username}</p>}

              <input type="text" name="name" placeholder="Họ và tên" onChange={handleChange} className="register__input" />
              {errors.name && <p className="register__error">{errors.name}</p>}

              <input type="date" name="dateOfBirth" onChange={handleChange} className="register__input" />
              {errors.dateOfBirth && <p className="register__error">{errors.dateOfBirth}</p>}

              <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} className="register__input" />
              {errors.password && <p className="register__error">{errors.password}</p>}

              <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" onChange={handleChange} className="register__input" />
              {errors.confirmPassword && <p className="register__error">{errors.confirmPassword}</p>}

              <input type="email" name="email" placeholder="Email" onChange={handleChange} className="register__input" />
              {errors.email && <p className="register__error">{errors.email}</p>}

              <input type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} className="register__input" />
              {errors.phone && <p className="register__error">{errors.phone}</p>}

              <button type="submit" className="register__button">Đăng ký</button>
            </form>
          </div>
        </div>
      </main>
  );
};

export default RegisterPage;
