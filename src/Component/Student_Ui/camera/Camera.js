import React, { useEffect, useRef, useState } from "react";
import "./Camera.css";
import { Button, Form, notification } from "antd";
import axios from "axios";
import * as faceapi from "face-api.js";
import zIndex from "@mui/material/styles/zIndex";
import moment from "moment";
const Camera = (props) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const videoRef = useRef();
  useEffect(() => {
    initCamera();
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      ]);
      getImageUrl();
    };

    loadModels();
  }, []);
  const loadImage = async () => {
    if (imageUrl) {
      const img = await faceapi.fetchImage(imageUrl);
      return img;
    } else {
      return false;
    }
  };
  const getImageUrl = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/students/image-url/${props.studentId}`
    );
    if (response.status === 200) {
      setImageUrl(response.data.url);
    } else {
      notification.warning({ message: "Không tìm thấy ảnh đối chiếu" });
    }
  };
  const detectAndCompare = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
    if (videoRef.current) {
      let inTime = true;
      try {
        var startDate = moment(props.startDate); // Ví dụ: 12:00:00 ngày 10/07/2024
        // Lấy giờ và phút của startDate
        var startHour = startDate.hours();
        var startMinute = startDate.minutes();

        // Lấy giờ và phút của thời điểm hiện tại
        var currentHour = moment().hours();
        var currentMinute = moment().minutes();

        // Tính số phút chênh lệch giữa startDate và thời điểm hiện tại
        var diffMinutes =
          (currentHour - startHour) * 60 + (currentMinute - startMinute);
        if (diffMinutes > 5) {
          inTime = false;
        } else {
          inTime = true;
        }
      } catch (error) {}
      const time = moment().format("YYYY-MM-DD HH:mm:ss");
      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const canvas = document.createElement("canvas");
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);
      ctx.font = "600 16px Arial"; // font-weight 600, font-size 16px
      // Thiết lập màu sắc
      ctx.fillStyle = "red";
      let text = "";
      if (inTime) {
        text = "Điểm danh đúng hạn";
      } else {
        text = "Điểm danh muộn";
      }
      ctx.fillText(text, 30, 60);
      ctx.fillText(time, 30, 30);
      const image = canvas.toDataURL("image/png");
      const formData = new FormData();
      const blob = base64ToBlob(image.split(",")[1]);
      const nameImage = `${props.studentId}-${time}`;
      formData.append("image", blob, nameImage);
      formData.append("studentId", props.studentId);
      // Phát hiện khuôn mặt trong video
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      // Tải hình ảnh để so sánh
      const img = await loadImage();
      if (!img) {
        notification.warning({
          message: "Không tìm thấy ảnh đối chiếu trên dữ liệu",
        });
        setLoading(false);
        return;
      }
      // Phát hiện khuôn mặt trong hình ảnh
      const detectionsImg = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections.length > 0 && detectionsImg) {
        // Tạo face matcher
        const faceMatcher = new faceapi.FaceMatcher(detections);

        // Tìm kết quả tốt nhất
        const bestMatch = faceMatcher.findBestMatch(detectionsImg.descriptor);
        if (bestMatch._distance <= 0.4) {
          notification.success({ message: "Nhận diện thành công" });
          const uploadState = await axios.post(
            "http://localhost:3000/upload-image-checkin",
            formData
          );
          if (uploadState.data.url) {
            notification.success({ message: "Upload Ảnh Checkin Thành Công" });
          }
          const data = {
            StudentId: props.studentId,
            CourseName: props.courseName,
          };
          const response = await axios.post(
            "http://localhost:3000/checkin",
            data
          );
          if (response.data.status === 201) {
            notification.success({ message: "Điểm danh thành công" });
          }
        } else {
          notification.error({ message: "Không nhận diện được" });
        }
        setLoading(false);
      }
    }
  };
  const initCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          console.error("User denied camera access");
          // Xử lý khi người dùng từ chối quyền truy cập camera
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          console.error("No camera/microphone found");
          // Xử lý khi không tìm thấy camera hoặc microphone
        } else {
          console.error("Error accessing camera:", error);
          // Xử lý các lỗi khác
        }
      });
  };
  const captureImage = async () => {
    try {
      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const canvas = document.createElement("canvas");
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0);
      const image = canvas.toDataURL("image/png");
      const formData = new FormData();
      const blob = base64ToBlob(image.split(",")[1]);
      formData.append("image", blob, props.studentId);
      formData.append("studentId", props.studentId);
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData
      );
      if (response.data.url) {
        notification.success({ message: "Đăng ký & Upload Ảnh Thành Công" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const base64ToBlob = (base64String) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "image/jpeg" }); // Adjust the type according to your data
  };
  return (
    <div className="cameraBound">
      {loading && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            fontWeight: "bold",
            fontSize: 20,
            background: "#fff",
            opacity: 0.6,
          }}
        >
          Loading...
        </div>
      )}
      <div className="videoBound">
        <video ref={videoRef} autoPlay playsInline muted></video>
      </div>
      <div className="videoFooter">
        {props.checkin ? (
          <Button type="primary" onClick={detectAndCompare}>
            Checkin
          </Button>
        ) : (
          <Button type="primary" onClick={captureImage}>
            Chụp ảnh & Gửi
          </Button>
        )}
      </div>
    </div>
  );
};

export default Camera;
