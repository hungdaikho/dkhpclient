import "antd/dist/reset.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import LoginForm from "./Component/LoginForm";
import StudentDashboard from "./Component/Student_Ui/StudentDashboard";
import CourseForm from "./Component/Admin_Ui/Form_Admin/CourseForm";
import DepartmentForm from "./Component/Admin_Ui/Form_Admin/DepartmentForm";
import SemesterForm from "./Component/Admin_Ui/Form_Admin/SemesterForm";
import AdminDashboard from "./Component/Admin_Ui/AdminDashboard";
import Schedule from "./Component/Student_Ui/Schedule";
import InfoStudent from "./Component/Student_Ui/InfoStudent";
import "./style/Schedule.css";
const App = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/manage-courses" element={<CourseForm />} />
          <Route path="/manage-semesters" element={<SemesterForm />} />
          <Route path="/manage-departments" element={<DepartmentForm />} />
          <Route path="/schedule/" element={<Schedule />} />
          <Route path="/info-student" element={<InfoStudent />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
