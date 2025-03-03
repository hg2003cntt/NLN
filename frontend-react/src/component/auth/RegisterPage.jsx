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

    if (!username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    } else if (username.length < 5) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 5 ký tự";
    } else if (/^\d+$/.test(username)) {
      newErrors.username = "Tên đăng nhập không thể chỉ chứa số";
    }

    if (!name.trim()) {
      newErrors.name = "Họ và tên không được để trống";
    } else if (name.split(" ").length < 2) {
      newErrors.name = "Họ và tên chưa hợp lệ";
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh không được để trống";
    } else if (currentYear - birthYear < 18) {
      newErrors.dateOfBirth = "Bạn phải đủ 18 tuổi trở lên";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    }

    if (!phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatName = (name) => {
    return name
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/\s+/g, " ")
      .trim();
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
