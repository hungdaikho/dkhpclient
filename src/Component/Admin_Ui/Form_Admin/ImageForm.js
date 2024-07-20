import React, { useEffect, useState } from "react";
import { Row, Col, Card, Image } from "antd";
import axios from "axios";

const ImageForm = ({}) => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    const initImage = async () => {
      try {
        const response = await axios.get("http://localhost:3000/get-images");
        if (response.data.images) {
          setImages(response.data.images);
        }
      } catch (error) {}
    };
    initImage();
  }, []);
  return (
    <div>
      <Row gutter={16}>
        {images.map((image, index) => (
          <Col key={index} span={12} style={{ marginBottom: 16 }}>
            <Card cover={<Image src={`${image.Key}`} />}>
              <Card.Meta
                title={`Image ${index + 1}`}
                description={`Thời gian: ${image.LastModified}`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ImageForm;
