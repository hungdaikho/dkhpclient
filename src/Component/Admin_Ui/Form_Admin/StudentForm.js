import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./style_admin/StudentForm.css";

const StudentForm = () => {
  const [students, setStudents] = useState([]);
  const [users, , setUsers] = useState([]);
  const [notification, setNotification] = useState(null);

  const [newStudent, setNewStudent] = useState({
    Student_ID: "",
    Full_Name: "",
    Date_of_Birth: "",
    Gender: "",
    Address: "",
    Email: "",
    email: "",
    Phone_Number: "",
    Department_Code: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudentId, setEditingStudentId] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchUsers();
    Modal.setAppElement("#root");
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/students");
      setStudents(response.data.data.students);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      if (response.data && response.data.data && response.data.data.users) {
        setUsers(response.data.data.users);
      }
      console.log(response);
    } catch (error) {
      console.error(error + "lỗi user");
    }
  };

  const createUserAndStudent = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        email: newStudent.email,
        password: newStudent.password,
        studentInfo: {
          Student_ID: newStudent.Student_ID,
          Full_Name: newStudent.Full_Name,
          Date_of_Birth: newStudent.Date_of_Birth,
          Gender: newStudent.Gender,
          Address: newStudent.Address,
          Email: newStudent.Email,
          Phone_Number: newStudent.Phone_Number,
          Department_Code: newStudent.Department_Code,
        },
      };

      const response = await axios.post(
        "http://localhost:3000/users",
        userData
      );
      fetchStudents();
      fetchUsers();
      console.log(response.data.message);
    } catch (error) {
      console.error(error); // Log error message
    }
  };
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/students/${selectedStudent._id}`,
        selectedStudent
      );

      fetchStudents();
      setIsModalOpen(false);
      setSelectedStudent(null);
      setEditingStudentId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };
  const openModal = (student) => {
    setIsModalOpen(true);
    setSelectedStudent(student);
    setEditingStudentId(student._id);
  };

  return (
    <div className="ccc">
      <h1 style={{ display: "flex", justifyContent: "center" }}>Student</h1>

      <form onSubmit={createUserAndStudent}>
        <div className="cc1">
          <table>
            <thead>
              <tr>
                <th>Mã sinh viên</th>
                <th>Tên Sinh Viên</th>
                <th>Email</th>
                <th>Mật khẩu</th>
                <th>Email Đăng Nhập</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    value={newStudent.Student_ID}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        Student_ID: e.target.value,
                      })
                    }
                    placeholder="ID sinh viên"
                    className="student-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newStudent.Full_Name}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        Full_Name: e.target.value,
                      })
                    }
                    placeholder="Tên sinh viên"
                    className="student-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newStudent.Email}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        Email: e.target.value,
                      })
                    }
                    placeholder="Email"
                    className="student-input"
                  />
                </td>
                <td>
                  <input
                    type="password"
                    value={newStudent.password}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        password: e.target.value,
                      })
                    }
                    placeholder="Mật khẩu"
                    className="student-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        email: e.target.value,
                      })
                    }
                    placeholder="email dùng để đăng nhập"
                    className="student-eamil-1"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="cc2">
          <table>
            <thead>
              <tr>
                <th>Số Điện Thoại</th>
                <th>Địa chỉ</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Khoa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    value={newStudent.Phone_Number}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        Phone_Number: e.target.value,
                      })
                    }
                    placeholder="Số điện thoại"
                    className="student-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newStudent.Address}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        Address: e.target.value,
                      })
                    }
                    placeholder="Địa chỉ"
                    className="student-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={newStudent.Date_of_Birth}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        Date_of_Birth: e.target.value,
                      })
                    }
                    className="student-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newStudent.Gender}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        Gender: e.target.value,
                      })
                    }
                    placeholder="Giới tính"
                    className="student-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newStudent.Department_Code}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        Department_Code: e.target.value,
                      })
                    }
                    placeholder="Khoa"
                    className="student-input"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="cc3">
          <td>
            <button type="submit" className="submit-button">
              Tạo mới
            </button>
          </td>
        </div>

        {notification && <div className="notification">{notification}</div>}
      </form>
      <div className="cc4">
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Danh sách sinh viên
        </h2>
      </div>
      <div className="cc5">
        <table>
          <thead>
            <tr>
              <th>Mã sinh viên</th>
              <th>Tên Sinh Viên</th>
              <th>Email</th>
              <th>Số Điện Thoại</th>
              <th>Địa chỉ</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Khoa</th>
              <th>Role</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const user = users.find((user) => user.email === student.Email);
              const role = user?.isAdmin ? "Admin" : "Student";
              return (
                <React.Fragment key={student._id}>
                  <tr>
                    <td>{student.Student_ID}</td>
                    <td>{student.Full_Name}</td>
                    <td>{student.Email}</td>
                    <td>{student.Phone_Number}</td>
                    <td>{student.Address}</td>
                    <td>{student.Date_of_Birth}</td>
                    <td>{student.Gender}</td>
                    <td>{student.Department_Code}</td>
                    <td>{role}</td>
                    <td>
                      <div className="acction-1">
                        <button
                          className="update-button-123"
                          onClick={() => openModal(student)}
                        >
                          Cập nhật
                        </button>
                        <button
                          className="delete-button-123"
                          onClick={() => handleDeleteStudent(student._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingStudentId === student._id && (
                    <tr key={`${selectedStudent?._id}-edit`}>
                      <td colSpan="5">
                        <div className="edit-semester-form-123">
                          <h2>Edit Student</h2>
                          <form onSubmit={handleUpdateStudent}>
                            <label>
                              Student ID:
                              <input
                                type="text"
                                value={selectedStudent?.Student_ID}
                                onChange={(e) =>
                                  setSelectedStudent({
                                    ...selectedStudent,
                                    Student_ID: e.target.value,
                                  })
                                }
                              />
                            </label>

                            <label>
                              Full Name:
                              <input
                                type="text"
                                value={selectedStudent?.Full_Name}
                                onChange={(e) =>
                                  setSelectedStudent({
                                    ...selectedStudent,
                                    Full_Name: e.target.value,
                                  })
                                }
                              />
                            </label>
                            <label>
                              Email:
                              <input
                                type="text"
                                value={selectedStudent?.Email}
                                onChange={(e) =>
                                  setSelectedStudent({
                                    ...selectedStudent,
                                    Email: e.target.value,
                                  })
                                }
                              />
                            </label>
                            <label>
                              Phone Number:
                              <input
                                type="text"
                                value={selectedStudent?.Phone_Number}
                                onChange={(e) =>
                                  setSelectedStudent({
                                    ...selectedStudent,
                                    Phone_Number: e.target.value,
                                  })
                                }
                              />
                            </label>
                            <label>
                              Address:
                              <input
                                type="text"
                                value={selectedStudent?.Address}
                                onChange={(e) =>
                                  setSelectedStudent({
                                    ...selectedStudent,
                                    Address: e.target.value,
                                  })
                                }
                              />
                            </label>
                            <label>
                              Date of Birth:
                              <input
                                type="date"
                                value={selectedStudent?.Date_of_Birth}
                                onChange={(e) =>
                                  setSelectedStudent({
                                    ...selectedStudent,
                                    Date_of_Birth: e.target.value,
                                  })
                                }
                              />
                            </label>
                            <label>
                              Gender:
                              <input
                                type="text"
                                value={selectedStudent?.Gender}
                                onChange={(e) =>
                                  setSelectedStudent({
                                    ...selectedStudent,
                                    Gender: e.target.value,
                                  })
                                }
                              />
                            </label>
                            <label>
                              Department Code:
                              <input
                                type="text"
                                value={selectedStudent?.Department_Code}
                                onChange={(e) =>
                                  setSelectedStudent({
                                    ...selectedStudent,
                                    Department_Code: e.target.value,
                                  })
                                }
                              />
                            </label>

                            {/* Your form inputs */}
                            <button type="submit">Update</button>
                            <button
                              onClick={() => setIsModalOpen(false)} // Thêm tham số false để đóng modal
                              className="submit-update"
                            >
                              Đóng
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentForm;
