import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, notification } from "antd";
import Camera from "./camera/Camera";
import History from "./history/History";
import moment from "moment";
const Schedule = () => {
  const [studentId, setStudentId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [hiddenStudentId, setHiddenStudentId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [classSchedule, setClassSchedule] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [startDate, setStartDate] = useState("");
  useEffect(() => {
    const studentIdFromStorage = localStorage.getItem("studentID");
    if (studentIdFromStorage) {
      setStudentId(studentIdFromStorage);
      setHiddenStudentId(studentIdFromStorage);
      fetchStudentDetails(studentIdFromStorage);
      fetchSemesters();
    }
  }, []);

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/students/${studentId}`
      );
      const student = response.data.data.student;
      setFullName(student.Full_Name);
      setDepartmentCode(student.Department_Code);
      setGender(student.Gender);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/semesters/`);
      setSemesters(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSemesterChange = (e) => {
    const selectedSemesterId = e.target.value;
    setSemesterId(selectedSemesterId);
    fetchClassScheduleBySemester(selectedSemesterId);
  };
  const fetchClassScheduleBySemester = async (selectedSemesterId) => {
    try {
      console.log(
        "Fetching class schedule for semesterId:",
        selectedSemesterId
      );

      // Gọi API để lấy danh sách các lớp học đã đăng ký trong học kỳ
      const response = await axios.get(
        `http://localhost:3000/api/class/registered-classes/${studentId}/${selectedSemesterId}`
      );

      // Lấy danh sách các lớp học đã đăng ký từ phản hồi
      const registeredClasses = response.data.registeredClasses;

      // Tạo đối tượng để lưu trữ lịch học theo ngày và khung giờ
      const updatedClassSchedule = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      };

      // Duyệt qua từng lớp học đã đăng ký để thêm thông tin vào lịch học
      registeredClasses.forEach((registration) => {
        if (registration.classId && registration.classId.schedule) {
          const { schedule } = registration.classId;
          updatedClassSchedule[schedule.dayOfWeek].push({
            timeSlot: schedule.timeSlot,
            className: registration.classId.Class_Name,
            instructor: registration.classId.Instructor,
            classroom: registration.classId.Classroom,
            startDate: registration.classId.startDate,
            endDate: registration.classId.endDate,
          });
        }
      });

      // Cập nhật state với lịch học đã được xây dựng từ danh sách lớp học đã đăng ký
      setClassSchedule(updatedClassSchedule);
    } catch (error) {
      console.error(error);
    }
  };

  const renderSemesterDropdown = () => (
    <select value={semesterId} onChange={handleSemesterChange}>
      <option value="">-- Chọn học kỳ --</option>
      {semesters.map((semester) => (
        <option key={semester._id} value={semester._id}>
          {semester.Semester_Name}
        </option>
      ))}
    </select>
  );
  const renderLessonInDay = (day) => {
    const lessonInDay = [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ];
    try {
      classSchedule[day]?.forEach((item) => {
        const startLesson = Number(item.timeSlot[0]);
        const endLessSon = Number(item.timeSlot[2]);
        lessonInDay[startLesson] = {
          ...item,
          rowSpan: endLessSon - startLesson + 1,
        };
        for (let i = startLesson + 1; i <= endLessSon; i++) {
          lessonInDay[i] = false;
        }
      });
    } catch (error) {}
    return lessonInDay;
  };
  const renderCourse = () => {
    const Monday = renderLessonInDay("Monday");
    const Tuesday = renderLessonInDay("Tuesday");
    const Wenesday = renderLessonInDay("Wenesday");
    const Thursday = renderLessonInDay("Thursday");
    const Friday = renderLessonInDay("Friday");
    const Saturday = renderLessonInDay("Saturday");
    const listCourses = [];
    for (let i = 0; i < 12; i++) {
      listCourses.push({
        Monday: Monday[i],
        Tuesday: Tuesday[i],
        Wenesday: Wenesday[i],
        Thursday: Thursday[i],
        Friday: Friday[i],
        Saturday: Saturday[i],
      });
    }
    return listCourses;
  };
  const renderTime = (index) => {
    switch (index) {
      case 1:
        return "7 - 7h45";
      case 2:
        return "8 - 8h45";
      case 3:
        return "9 - 9h45";
      case 4:
        return "10 - 10h45";
      case 5:
        return "11 - 11h45";
      case 6:
        return "12 - 12h45";
      case 7:
        return "13 - 13h45";
      case 8:
        return "14 - 14h45";
      case 9:
        return "15 - 15h45";
      case 10:
        return "16 - 16h45";
      case 11:
        return "17 - 17h45";
      case 12:
        return "18 - 18h45";
    }
  };
  const onCheckin = async (cn) => {
    const data = {
      StudentId: studentId,
      CourseName: cn,
    };
    const response = await axios.post(
      "http://localhost:3000/checkin/get-today",
      data
    );
    console.log(data);
    console.log(response);
    if (response.data.length > 0) {
      Modal.confirm({
        title: `Bạn đã điểm danh vào lúc ${moment(
          response.data[0].Time_Checkin
        ).format("YYYY-MM-DD HH:mm:ss")}, vui lòng không thao tác lại`,
        content: null,
        okText: "OK",
        cancelText: "Đóng",
        onOk() {},
        onCancel() {},
      });
    } else {
      setOpenModal(true);
    }
  };
  return (
    <div className="schedule-container">
      <Modal
        title="Chụp ảnh"
        open={openModal}
        footer={null}
        onCancel={() => {
          setOpenModal(false);
        }}
      >
        <Camera
          studentId={studentId}
          checkin={true}
          courseName={courseName}
          startDate={startDate}
        />
      </Modal>
      <h3 className="h3">Xin Chào ! {fullName}</h3>
      <p>Khoa : {departmentCode} </p>
      <div className="schedule-dropdown">
        <label>Chọn Học Kỳ:</label>
        {renderSemesterDropdown()}
      </div>
      {classSchedule && (
        <div>
          <h2 className="h2">Lịch Học</h2>
          <table className="schedule-table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Thời gian</th>
                <th style={{ width: "15%" }}>Thứ 2</th>
                <th style={{ width: "15%" }}>Thứ 3</th>
                <th style={{ width: "15%" }}>Thứ 4</th>
                <th style={{ width: "15%" }}>Thứ 5</th>
                <th style={{ width: "15%" }}>Thứ 6</th>
                <th style={{ width: "15%", position: "relative" }}>
                  Thứ 7 <button>IN</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {renderCourse() &&
                renderCourse()?.map((course, index) => {
                  return (
                    <tr>
                      <td>{`${index + 1} (${renderTime(index + 1)})`}</td>
                      {!course.Monday ? null : course.Monday === true ? (
                        <td></td>
                      ) : (
                        <td
                          rowSpan={
                            course.Monday?.rowSpan ? course.Monday.rowSpan : 1
                          }
                        >
                          <div
                            className="boxCourses"
                            onClick={() => {
                              setCourseName(course.Monday.className);
                              setStartDate(course.Monday.startDate);
                              onCheckin(course.Monday.className);
                            }}
                          >
                            {course.Monday.className}
                            <div>{course.Monday.classroom}</div>
                            <div>{course.Monday.instructor}</div>
                          </div>
                        </td>
                      )}
                      {!course.Tuesday ? null : course.Tuesday === true ? (
                        <td></td>
                      ) : (
                        <td
                          rowSpan={
                            course.Tuesday?.rowSpan ? course.Tuesday.rowSpan : 1
                          }
                        >
                          <div
                            className="boxCourses"
                            onClick={() => {
                              setCourseName(course.Tuesday.className);
                              setStartDate(course.Tuesday.startDate);
                              onCheckin(course.Tuesday.className);
                            }}
                          >
                            {course.Tuesday.className}
                            <div>{course.Tuesday.classroom}</div>
                            <div>{course.Tuesday.instructor}</div>
                          </div>
                        </td>
                      )}
                      {!course.Wenesday ? null : course.Wenesday === true ? (
                        <td></td>
                      ) : (
                        <td
                          rowSpan={
                            course.Wenesday?.rowSpan
                              ? course.Wenesday.rowSpan
                              : 1
                          }
                        >
                          <div
                            className="boxCourses"
                            onClick={() => {
                              setCourseName(course.Wenesday.className);
                              setStartDate(course.Wenesday.startDate);
                              onCheckin(course.Wenesday.className);
                            }}
                          >
                            {course.Wenesday.className}
                            <div>{course.Wenesday.classroom}</div>
                            <div>{course.Wenesday.instructor}</div>
                          </div>
                        </td>
                      )}
                      {!course.Thursday ? null : course.Thursday === true ? (
                        <td></td>
                      ) : (
                        <td
                          rowSpan={
                            course.Thursday?.rowSpan
                              ? course.Thursday.rowSpan
                              : 1
                          }
                        >
                          <div
                            className="boxCourses"
                            onClick={() => {
                              setCourseName(course.Thursday.className);
                              setStartDate(course.Thursday.startDate);
                              onCheckin(course.Thursday.className);
                            }}
                          >
                            {course.Thursday.className}
                            <div>{course.Thursday.classroom}</div>
                            <div>{course.Thursday.instructor}</div>
                          </div>
                        </td>
                      )}
                      {!course.Friday ? null : course.Friday === true ? (
                        <td></td>
                      ) : (
                        <td
                          rowSpan={
                            course.Friday?.rowSpan ? course.Friday.rowSpan : 1
                          }
                        >
                          <div
                            className="boxCourses"
                            onClick={() => {
                              setCourseName(course.Friday.className);
                              setStartDate(course.Friday.startDate);
                              onCheckin(course.Friday.className);
                            }}
                          >
                            {course.Friday.className}
                            <div>{course.Friday.classroom}</div>
                            <div>{course.Friday.instructor}</div>
                          </div>
                        </td>
                      )}
                      {!course.Friday ? null : course.Friday === true ? (
                        <td></td>
                      ) : (
                        <td
                          rowSpan={
                            course.Saturday?.rowSpan
                              ? course.Saturday.rowSpan
                              : 1
                          }
                        >
                          <div
                            className="boxCourses"
                            onClick={() => {
                              setCourseName(course.Saturday.className);
                              setStartDate(course.Saturday.startDate);
                              onCheckin(course.Saturday.className);
                            }}
                          >
                            {course.Saturday.className}
                            <div>{course.Saturday.classroom}</div>
                            <div>{course.Saturday.instructor}</div>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              {/* <tr>
                <td>Sáng</td>
                {Object.keys(classSchedule).map((day) => {
                  const timeSlot = classSchedule[day].find(
                    (item) => item.timeSlot === "1-3" || item.timeSlot === "4-6"
                  );
                  return (
                    <td key={`${day}-morning`}>
                      {timeSlot ? (
                        <div>
                          <p className="lecture">{timeSlot.className}</p>
                          <p>Giảng Viên: {timeSlot.instructor}</p>
                          <p>Phòng Học: {timeSlot.classroom}</p>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td>Chiều</td>
                {Object.keys(classSchedule).map((day) => {
                  const timeSlot = classSchedule[day].find(
                    (item) =>
                      item.timeSlot === "7-9" || item.timeSlot === "10-12"
                  );
                  return (
                    <td key={`${day}-afternoon`}>
                      {timeSlot ? (
                        <div>
                          <p className="lecture">{timeSlot.className}</p>
                          <p>Giảng Viên: {timeSlot.instructor}</p>
                          <p>Phòng Học: {timeSlot.classroom}</p>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td>Tối</td>
                {Object.keys(classSchedule).map((day) => {
                  const timeSlot = classSchedule[day].find(
                    (item) => item.timeSlot === "13-15"
                  );
                  return (
                    <td key={`${day}-evening`}>
                      {timeSlot ? (
                        <div>
                          <p className="lecture">{timeSlot.className}</p>
                          <p>Giảng Viên: {timeSlot.instructor}</p>
                          <p>Phòng Học: {timeSlot.classroom}</p>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </td>
                  );
                })}
              </tr> */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Schedule;
