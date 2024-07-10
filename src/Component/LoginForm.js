import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/login.css";
import logo from "../asset/logo.png";
import iuh from "../asset/iu1.png";
import iuh2 from "../asset/iuh2.png";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        email,
        password,
      });
      console.log(response.data);

      // Kiểm tra vai trò của người dùng
      if (response.data.isAdmin) {
        // Nếu là admin, chuyển hướng đến trang Admin Dashboard
        navigate("/admin-dashboard");
      } else {
        localStorage.setItem("studentID", response.data.studentId);
        // Nếu không phải là admin, chuyển hướng đến trang Student Dashboard
        navigate("/student-dashboard");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="title-header">
          <div className="img-title-header">
            <img
              src={iuh}
              alt="hiiiiiiiiiiiiiiiiiii"
              style={{ height: "auto", width: "100%" }}
            />
          </div>
          <div className="img-title-header2">
            <img
              src={iuh2}
              alt="hiiiiiiiiiiiiiiiiiii"
              style={{ height: "auto", width: "100%", marginTop: 20 }}
            />
          </div>
        </div>

        <div className="modal-login">
          <img
            src={logo}
            alt="Logo của hệ thống"
            style={{ height: 145, width: "90%", maxWidth: 450 }}
          />
          <h2>CỔNG ĐĂNG KÍ HỌC PHẦN</h2>
          <p>SINH VIÊN</p>
          <h3>Đăng nhập vào hệ thống</h3>

          <form onSubmit={handleSubmit} className="form-input">
            <div className="input-container">
              <p className="p-input" htmlFor="email">
                Email
              </p>

              <input
                id="email"
                className="input-class"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <p className="p-input" htmlFor="password">
                Password
              </p>
              <input
                id="password"
                className="input-class"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="button" type="submit">
              Đăng nhập
            </button>
          </form>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      </div>
      <footer style={{ backgroundColor: "white" }}>
        <div className="footer">
          <p>&copy; 2024 Trường Đại học Công nghiệp TP. Hồ Chí Minh</p>
          <p>
            Địa chỉ: Số 12 Nguyễn Văn Bão, Phường 4, Quận Gò Vấp, TP. Hồ Chí
            Minh
          </p>
          <p>Điện thoại: 0326026288</p>
          <p>Email: toanlemale11234@gmail.com</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginForm;
