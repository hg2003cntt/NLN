import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ApiService from "../../service/apiService";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/home";

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await ApiService.loginUser({ email, password });

            if (response.statusCode === 200) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("role", response.role);
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng nhập</h2>
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Mật khẩu: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>

            <p className="register-link">
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
        </div>
    );
}

export default LoginPage;
