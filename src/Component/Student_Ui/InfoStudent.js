import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style_student/infoStudent.css";

const InfoStudent = () => {
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [totalCreditHours, setTotalCreditHours] = useState(167);
  const [hoverContent, setHoverContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentIdFromStorage = localStorage.getItem("studentID");
    if (studentIdFromStorage) {
      setStudentId(studentIdFromStorage);
      fetchData(studentIdFromStorage);
    }
  }, []);

  const fetchData = async (studentId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/students/${studentId}`
      );
      const student = response.data.data.student;
      setFullName(student.Full_Name);
      setDepartmentCode(student.Department_Code);
      setGender(student.Gender);
      setAddress(student.Address);
      setEmail(student.Email);
      setPhoneNumber(student.Phone_Number);

      const coursesResponse = await axios.get(
        `http://localhost:3000/api/students/${studentId}/registered-courses`
      );
      setRegisteredCourses(coursesResponse.data.registeredCourses);

      const totalCredits = coursesResponse.data.registeredCourses.reduce(
        (acc, course) => acc + course.Credit_Hours,
        0
      );
      setTotalCreditHours(totalCredits);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const calculatePercentage = (totalCreditHours, targetCreditHours) => {
    return ((totalCreditHours / targetCreditHours) * 100).toFixed(2);
  };

  const handleHover = () => {
    setHoverContent(
      `${totalCreditHours} tín chỉ (${calculatePercentage(
        totalCreditHours,
        167
      )}%)`
    );
  };

  return (
    <div className="info-student-container">
      <h3>Thông tin sinh viên</h3>
      <p className="info">Họ và tên: {fullName}</p>
      <p className="info">Giới tính: {gender}</p>
      <p className="info">Khoa: {departmentCode}</p>
      <p className="info">Địa chỉ: {address}</p>
      <p className="info">Email: {email}</p>
      <p className="info">Số điện thoại: {phoneNumber}</p>

      <h1>Số lượng tín chỉ đã đạt được</h1>
      {!loading && (
        <svg
          viewBox="0 0 36 36"
          className="circular-chart"
          onMouseEnter={handleHover}
          onMouseLeave={() => setHoverContent("")}
        >
          <path
            className="circle-bg"
            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="circle"
            strokeDasharray={`${calculatePercentage(
              totalCreditHours,
              167
            )} 100`}
            d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" className="percentage">
            {calculatePercentage(totalCreditHours, 167)}%
          </text>
        </svg>
      )}
    </div>
  );
};

export default InfoStudent;
