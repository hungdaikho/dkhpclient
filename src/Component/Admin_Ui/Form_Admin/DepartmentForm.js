import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style_admin/Department.css";
import Modal from "react-modal";

const DepartmentForm = () => {
  // State
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    Department_Code: "",
    Department_Name: "",
  });
  const [loading, setLoading] = useState(true);

  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false); // State để kiểm soát hiển thị form cập nhật
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

  // Effect to fetch departments when component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Function to fetch departments from the server
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/departments");
      setDepartments(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle creation of a new department
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/departments", newDepartment);
      setNewDepartment({
        Department_Code: "",
        Department_Name: "",
      });
      fetchDepartments();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to open modal and set selected department
  const openUpdateForm = (department) => {
    setSelectedDepartment(department);
    setEditingDepartmentId(department._id);
    setIsUpdateFormOpen(true); // Mở form cập nhật
  };

  // Function to handle deletion of a department
  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/departments/${selectedDepartment._id}`,
        selectedDepartment
      );
      setEditingDepartmentId(null);
      fetchDepartments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="department-form-wrapper">
      <h3 className="department-form-title">Tạo mới phòng ban</h3>

      <div className="create-department-form">
        <form onSubmit={handleCreateDepartment}>
          <div className="input-group">
            <input
              type="text"
              value={newDepartment.Department_Code}
              onChange={(e) =>
                setNewDepartment({
                  ...newDepartment,
                  Department_Code: e.target.value,
                })
              }
              placeholder="Mã phòng ban"
              className="department-input"
            />
            <input
              type="text"
              value={newDepartment.Department_Name}
              onChange={(e) =>
                setNewDepartment({
                  ...newDepartment,
                  Department_Name: e.target.value,
                })
              }
              placeholder="Tên phòng ban"
              className="department-input"
            />
          </div>
          <div className="button">
            <button type="submit" className="submit-button">
              Tạo mới
            </button>
          </div>
        </form>
      </div>

      <div className="horizontal-line"></div>
      <div className="department-list">
        <h3 className="department-list-title">Danh sách phòng ban</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="department-table">
            <thead>
              <tr>
                <th>Mã phòng ban</th>
                <th>Tên phòng ban</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <React.Fragment key={department._id}>
                  <tr>
                    <td>{department.Department_Code}</td>
                    <td>{department.Department_Name}</td>
                    <td>
                      <button
                        className="update-button"
                        onClick={() => openUpdateForm(department)}
                      >
                        Cập nhật
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteDepartment(department._id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                  {editingDepartmentId === department._id && (
                    <tr key={`${selectedDepartment?._id}-edit`}>
                      <td colSpan="3">
                        <ul className="edit-department-form">
                          <div>
                            <form
                              className="update-department-form"
                              onSubmit={handleUpdateDepartment}
                            >
                              <input
                                type="text"
                                value={selectedDepartment?.Department_Code}
                                onChange={(e) =>
                                  setSelectedDepartment({
                                    ...selectedDepartment,
                                    Department_Code: e.target.value,
                                  })
                                }
                                placeholder="Mã phòng ban"
                              />
                              <input
                                type="text"
                                value={selectedDepartment?.Department_Name}
                                onChange={(e) =>
                                  setSelectedDepartment({
                                    ...selectedDepartment,
                                    Department_Name: e.target.value,
                                  })
                                }
                                placeholder="Tên phòng ban"
                              />
                              <div className="button-group">
                                <button className="submit-update" type="submit">
                                  Cập nhật
                                </button>
                                
                                <button
                                  onClick={() => setEditingDepartmentId(null)}
                                  className="submit-update"
                                >
                                  Hủy
                                </button>
                              </div>
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
        )}
      </div>
    </div>
  );
};

export default DepartmentForm;
