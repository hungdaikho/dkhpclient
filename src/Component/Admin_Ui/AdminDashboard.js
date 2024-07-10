import React, { useState } from "react";
import "./AdminDashboard.css"; // Import CSS file for styling
import CourseForm from "./Form_Admin/CourseForm";
import SemesterForm from "./Form_Admin/SemesterForm";
import DepartmentForm from "./Form_Admin/DepartmentForm";
import ClassForm from "./Form_Admin/ClassForm";
import StudentForm from "./Form_Admin/StudentForm";

const AdminDashboard = () => {
  const [selectedContent, setSelectedContent] = useState('');

  const handleMenuClick = (content) => {
    setSelectedContent(content);
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
      <h2>Menu </h2>
        <ul>
          <li onClick={() => handleMenuClick("manage-courses")}>Quản Lý Môn Học</li>
          <li onClick={() => handleMenuClick("manage-classes")}>Quản Lý Lớp Học</li>
          <li onClick={() => handleMenuClick("manage-semesters")}>Quản Lý Học Kỳ</li>
          <li onClick={() => handleMenuClick("manage-departments")}>Quản Lý Khoa</li>
          <li onClick={() => handleMenuClick("manage-Student")}>Quản Lý Sinh Viên</li>
        </ul>
      </div>
      <div className="main-content">
        <h2>Trang Giao Diện của Admin</h2>
        {/* Render the selected content */} 
        {selectedContent === "manage-courses" && <CourseForm />}
        {selectedContent === "manage-classes" && < ClassForm/>}
        {selectedContent === "manage-semesters" && <SemesterForm />}
        {selectedContent === "manage-departments" && <DepartmentForm />}
        {selectedContent === "manage-Student" && <StudentForm />}

      </div>
    </div>
  );
};

export default AdminDashboard;
