import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./style_admin/SemesterForm.css";

const SemesterForm = () => {
  const [semesters, setSemesters] = useState([]);
  const [newSemester, setNewSemester] = useState({
    Semester_ID: "",
    Semester_Name: "",
    Year: "",
    Start_Date: "",
    End_Date: "",
  });
  const [ ,setIsModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [editingSemesterId, setEditingSemesterId] = useState(null);

  useEffect(() => {
    fetchSemesters();
    Modal.setAppElement("#root");
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await axios.get("http://localhost:3000/semesters");
      setSemesters(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateSemester = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/semesters", newSemester);
      setNewSemester({
        Semester_ID: "",
        Semester_Name: "",
        Year: "",
        Start_Date: "",
        End_Date: "",
      });
      fetchSemesters();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateSemester = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/semesters/${selectedSemester._id}`,
        selectedSemester
      );
      fetchSemesters();
      setIsModalOpen(false);
      setSelectedSemester(null);
      setEditingSemesterId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSemester = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/semesters/${id}`);
      fetchSemesters();
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (semester) => {
    setIsModalOpen(true);
    setSelectedSemester(semester);
    setEditingSemesterId(semester._id);
  };

  return (
    <div className="semester-form-wrapper">
      <h3 className="semester-form-title">Tạo mới học kỳ</h3>
      <div className="create-semester-form">
        <div className="semester-inputs">
          <form onSubmit={handleCreateSemester}>
            <table className="semester-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên học kỳ</th>
                  <th>Năm học</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      value={newSemester.Semester_ID}
                      onChange={(e) =>
                        setNewSemester({
                          ...newSemester,
                          Semester_ID: e.target.value,
                        })
                      }
                      placeholder="ID học kỳ"
                      className="semester-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newSemester.Semester_Name}
                      onChange={(e) =>
                        setNewSemester({
                          ...newSemester,
                          Semester_Name: e.target.value,
                        })
                      }
                      placeholder="Tên học kỳ"
                      className="semester-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newSemester.Year}
                      onChange={(e) =>
                        setNewSemester({
                          ...newSemester,
                          Year: e.target.value,
                        })
                      }
                      placeholder="Năm học"
                      className="semester-input"
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={newSemester.Start_Date}
                      onChange={(e) =>
                        setNewSemester({
                          ...newSemester,
                          Start_Date: e.target.value,
                        })
                      }
                      className="semester-input"
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={newSemester.End_Date}
                      onChange={(e) =>
                        setNewSemester({
                          ...newSemester,
                          End_Date: e.target.value,
                        })
                      }
                      className="semester-input"
                    />
                  </td>
                  <td>
                    <button type="submit" className="submit-button">
                      Tạo mới
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>

      <div className="horizontal-line"></div>

      <div className="semester-list">
        <h3 className="semester-list-title">Danh sách học kỳ</h3>
        <table className="semester-table">
          <thead>
            <tr>
              <th>Tên học kỳ</th>
              <th>Năm học</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {semesters.map((semester) => (
              <React.Fragment key={semester._id}>
                <tr>
                  <td>{semester.Semester_Name}</td>
                  <td>{semester.Year}</td>
                  <td>{semester.Start_Date}</td>
                  <td>{semester.End_Date}</td>
                  <td>
                    <button
                      className="update-button"
                      onClick={() => openModal(semester)}
                    >
                      Cập nhật
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteSemester(semester._id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
                
                {editingSemesterId === semester._id && (
                  <tr key={`${selectedSemester?._id}-edit`}>
                    <td colSpan="5">
                      <ul className="edit-semester-form">
                        <div>
                          <form onSubmit={handleUpdateSemester}>
                            <input
                              type="text"
                              value={selectedSemester?.Semester_Name}
                              onChange={(e) =>
                                setSelectedSemester({
                                  ...selectedSemester,
                                  Semester_Name: e.target.value,
                                })
                              }
                              placeholder="Tên học kỳ"
                            />
                            <input
                              type="text"
                              value={selectedSemester?.Year}
                              onChange={(e) =>
                                setSelectedSemester({
                                  ...selectedSemester,
                                  Year: e.target.value,
                                })
                              }
                              placeholder="Năm học"
                            />
                            <input
                              type="date"
                              value={selectedSemester?.Start_Date}
                              onChange={(e) =>
                                setSelectedSemester({
                                  ...selectedSemester,
                                  Start_Date: e.target.value,
                                })
                              }
                              placeholder="Ngày bắt đầu"
                            />
                            <input
                              type="date"
                              value={selectedSemester?.End_Date}
                              onChange={(e) =>
                                setSelectedSemester({
                                  ...selectedSemester,
                                  End_Date: e.target.value,
                                })
                              }
                              placeholder="Ngày kết thúc"
                            />
                            <button className="submit-update" type="submit">Cập nhật</button>
                            <button
                              onClick={() => setIsModalOpen()}
                              className="submit-update"
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

export default SemesterForm;
