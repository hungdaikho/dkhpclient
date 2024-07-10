import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./style_admin/CourseForm.css";

const CourseForm = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    Course_Name: "",
    Course_ID: "",
    Credit_Hours: "",
    Department_Code: "",
    Semester_ID: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchSemesters();
    fetchDepartments();
    Modal.setAppElement("#root");
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/courses");
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get("http://localhost:3000/semesters");
      setSemesters(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    // Kiểm tra xem tất cả các trường dữ liệu đã được điền đầy đủ hay không
    if (
      !newCourse.Course_Name ||
      !newCourse.Course_ID ||
      !newCourse.Credit_Hours
    ) {
      // Nếu có trường dữ liệu nào bị để trống, hiển thị một cảnh báo và không thêm mới
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    // Biểu thức regex
    const regexCourseName = /^[^\s].{1,100}$/;
    const regexCourseID = /^[0-9]{3,10}$/;
    const regexCreditHours = /^[1-9]\d*$/;

    // Kiểm tra từng trường dữ liệu
    if (!regexCourseName.test(newCourse.Course_Name)) {
      alert("Tên khóa học không hợp lệ.");
      return;
    }
    if (!regexCourseID.test(newCourse.Course_ID)) {
      alert("ID khóa học không hợp lệ.");
      return;
    }
    if (!regexCreditHours.test(newCourse.Credit_Hours)) {
      alert("Số tín chỉ không hợp lệ.");
      return;
    }
    // Kiểm tra mã khóa học đã tồn tại chưa
    try {
      const existingCourse = courses.find(
        (course) => course.Course_ID === newCourse.Course_ID
      );
      if (existingCourse) {
        alert("Mã khóa học đã tồn tại, không thể thêm mới.");
        return;
      } else {
        await axios.post("http://localhost:3000/courses", newCourse);
        setNewCourse({
          Course_Name: "",
          Course_ID: "",
          Credit_Hours: "",
          Department_Code: "",
          Semester_ID: "",
        });
        fetchCourses();
      }
    } catch (error) {
      console.error(error);
    }
    console.log(newCourse);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/courses/${selectedCourse._id}`,
        selectedCourse
      );
      fetchCourses();
      setIsModalOpen(false);
      setSelectedCourse(null);
      setEditingCourseId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (course) => {
    setIsModalOpen(true);
    setSelectedCourse(course);
    setEditingCourseId(course._id);
  };

  return (
    <div class="header-form">
      <h3 class="form-title">Tạo mới khóa học</h3>
      <div class="create-course-form">
        <div class="course-form">
          <form onSubmit={handleCreateCourse}>
            <div class="container-input-1">
              <input
                type="text"
                value={newCourse.Course_Name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, Course_Name: e.target.value })
                }
                placeholder="Tên Môn Học"
                class="input-field"
              />
              <input
                type="text"
                value={newCourse.Course_ID}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, Course_ID: e.target.value })
                }
                placeholder="Mã Môn Học"
                class="input-field"
              />
              <input
                type="number"
                value={newCourse.Credit_Hours}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, Credit_Hours: e.target.value })
                }
                placeholder="Số tín chỉ"
                class="input-field"
              />
            </div>
            <div class="container-input-3">
              <select
                value={newCourse.Semester_ID}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, Semester_ID: e.target.value })
                }
                class="select-field"
              >
                <option value="">Chọn kỳ học</option>
                {semesters.map((semester) => (
                  <option key={semester._id} value={semester._id}>
                    {semester.Semester_Name}
                  </option>
                ))}
              </select>
              <select
                value={newCourse.Department_Code}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    Department_Code: e.target.value,
                  })
                }
                class="select-field"
              >
                <option value="">Chọn phòng ban</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.Department_Name}
                  </option>
                ))}
              </select>
            </div>
            <div class="button">
              <button type="submit" class="submit-button">
                Tạo mới
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="horizontal-line"></div>

      {/* ở đây */}
      <div className="course-khoahoc">
        <h3 className="course-title">Danh sách khóa học</h3>
        <table className="course-table">
          <thead>
            <tr>
              <th>Tên Môn Học</th>
              <th>Số tín chỉ</th>
              <td style={{backgroundColor:"#3399ff",color:"#FFFFFF"}}>Kỳ học</td>
              <td style={{backgroundColor:"#3399ff",color:"#FFFFFF"}}>Phòng ban</td>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <React.Fragment key={course._id}>
                <tr>
                  <td>{course.Course_Name}</td>
                  <td>{course.Credit_Hours}</td>
                  <td>
                    {
                      semesters.find(
                        (semester) => semester._id === course.Semester_ID
                      )?.Semester_Name
                    }
                  </td>
                  <td>
                    {
                      departments.find(
                        (department) =>
                          department._id === course.Department_Code
                      )?.Department_Name
                    } 
                  </td>

                  <td>
                    <button
                      className="update-button"
                      onClick={() => openModal(course)}
                    >
                      Cập nhật
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
                {editingCourseId === course._id && (
                  <tr key={`${selectedCourse?._id}-edit`}>
                    <td colSpan="6">
                      <ul className="edit-course-form">
                        <div>
                          <form onSubmit={handleUpdateCourse}>
                            <input
                              type="text"
                              value={selectedCourse?.Course_Name}
                              onChange={(e) =>
                                setSelectedCourse({
                                  ...selectedCourse,
                                  Course_Name: e.target.value,
                                })
                              }
                              placeholder="Tên môn học"
                            />
                            <input
                              type="text"
                              value={selectedCourse?.Course_ID}
                              onChange={(e) =>
                                setSelectedCourse({
                                  ...selectedCourse,
                                  Course_ID: e.target.value,
                                })
                              }
                              placeholder="ID môn học"
                            />
                            <input
                              type="number"
                              value={selectedCourse?.Credit_Hours}
                              onChange={(e) =>
                                setSelectedCourse({
                                  ...selectedCourse,
                                  Credit_Hours: e.target.value,
                                })
                              }
                              placeholder="Số tín chỉ"
                            />

                            {/* Dropdown để chọn kỳ học */}
                            <select
                              value={selectedCourse?.Semester_ID}
                              onChange={(e) =>
                                setSelectedCourse({
                                  ...selectedCourse,
                                  Semester_ID: e.target.value,
                                })
                              }
                            >
                              <option value="">Chọn kỳ học</option>
                              {semesters.map((semester) => (
                                <option key={semester._id} value={semester._id}>
                                  {semester.Semester_Name}
                                </option>
                              ))}
                            </select>

                            {/* Dropdown để chọn phòng ban */}
                            <select
                              value={selectedCourse?.Department_Code}
                              onChange={(e) =>
                                setSelectedCourse({
                                  ...selectedCourse,
                                  Department_Code: e.target.value,
                                })
                              }
                            >
                              <option value="">Chọn phòng ban</option>
                              {departments.map((department) => (
                                <option
                                  key={department._id}
                                  value={department.Department_Code}
                                >
                                  {department.Department_Name}
                                </option>
                              ))}
                            </select>
                            <button type="submit">Cập nhật</button>
                            <button
                              onClick={() => setIsModalOpen(false)}
                              className="close-button"
                            >
                              Đóng
                            </button>
                          </form>
                        </div>
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CourseForm;
