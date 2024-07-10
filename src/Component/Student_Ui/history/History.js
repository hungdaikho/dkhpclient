import React from "react";
import "./History.css";
const History = (props) => {
  console.log(props.data);
  return (
    <div className="historyCheckin">
      <b>Lịch sử điểm danh môn học</b>
    </div>
  );
};

export default History;
