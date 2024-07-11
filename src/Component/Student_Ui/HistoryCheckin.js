import { Button, Image, List, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const HistoryCheckin = (props) => {
  const [count, setCount] = useState(0);
  const [maxStudents, setMaxStudents] = useState(0);
  const [listImage, setListImage] = useState([]);
  const getCheckined = async (CourseName) => {
    try {
      const url = "http://localhost:3000/checkin/checkins-count-today";
      const response = await axios.post(url, { CourseName: CourseName });
      if (response.data.count && response.data.maxStudents) {
        setCount(response.data.count);
        setMaxStudents(response.data.maxStudents);
        setListImage(response.data.imagePaths);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCheckined(props.CourseName);
  }, [props.CourseName]);
  return count && maxStudents ? (
    <div>
      {" "}
      <div>
        Đã điểm danh <span>{count}</span> / <span>{maxStudents}</span>{" "}
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            Modal.confirm({
              title: "Confirm",
              content: (
                <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                  <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={listImage}
                    renderItem={(item) => (
                      <List.Item>
                        <Image src={item} />
                      </List.Item>
                    )}
                  />
                </div>
              ),
              onOk() {
              },
              onCancel() {
                // Xử lý khi nhấn Cancel
              },
            });
          }}
        >
          Xem ảnh điểm danh
        </Button>
      </div>
    </div>
  ) : null;
};

export default HistoryCheckin;
