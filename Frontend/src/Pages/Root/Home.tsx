import React, { useState } from "react";
import {
  Slider,
  Button,
  Radio,
  Switch,
  Input,
  message,
  Typography,
} from "antd";

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [operation, setOperation] = useState<string>("");
  const [restorationType, setRestorationType] = useState<string>("");
  const [polishing, setPolishing] = useState<boolean>(false);
  const [width, setWidth] = useState<string | number>("");
  const [height, setHeight] = useState<string | number>("");
  const [smartCrop, setSmartCrop] = useState<string>("center");
  const [hdr, setHdr] = useState<number>(50);
  const [backgroundRemoval, setBackgroundRemoval] = useState<boolean>(false);
  const [objectDetection, setObjectDetection] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
      message.success("Image uploaded successfully!");
    }
  };

  const handleWidthChange = (value: string) => {
    if (value.endsWith("%")) {
      setWidth(value);
    } else {
      const intValue = parseInt(value, 10);
      if (!isNaN(intValue)) {
        setWidth(intValue);
      }
    }
  };

  const handleHeightChange = (value: string) => {
    if (value.endsWith("%")) {
      setHeight(value);
    } else {
      const intValue = parseInt(value, 10);
      if (!isNaN(intValue)) {
        setHeight(intValue);
      }
    }
  };

  const renderOptions = () => {
    if (!operation) return null;

    switch (operation) {
      case "restoration":
        return (
          <div className="mt-4">
            <Title level={4} style={{ color: "#ffffff" }}>
              Select Restoration Type
            </Title>
            <Radio.Group
              onChange={(e) => setRestorationType(e.target.value)}
              value={restorationType}
            >
              <Radio value="smart_enhance">Smart Enhance</Radio>
              <Radio value="smart_resize">Smart Resize</Radio>
              <Radio value="digital_art">Digital Art</Radio>
              <Radio value="faces">Faces</Radio>
              <Radio value="photo">Photo</Radio>
            </Radio.Group>
            <div className="mt-2">
              <label className="text-lg font-semibold" style={{ color: "#ffffff" }}>
                Apply Polishing
              </label>
              <Switch
                checked={polishing}
                onChange={setPolishing}
                className="ml-2"
              />
            </div>
          </div>
        );

      case "resizing":
        return (
          <div className="mt-4">
            <Title level={4} style={{ color: "#ffffff" }}>
              Specify Width and Height
            </Title>
            <Input
              placeholder="Width (px or %)"
              onChange={(e) => handleWidthChange(e.target.value)}
              className="mt-2"
              style={{ backgroundColor: "#333", color: "#fff" }}
            />
            <Input
              placeholder="Height (px or %)"
              onChange={(e) => handleHeightChange(e.target.value)}
              className="mt-2"
              style={{ backgroundColor: "#333", color: "#fff" }}
            />
            <div className="mt-4">
              <label className="text-lg font-semibold" style={{ color: "#ffffff" }}>
                Smart Cropping
              </label>
              <select
                onChange={(e) => setSmartCrop(e.target.value)}
                value={smartCrop}
                className="ml-2 border p-1"
                style={{ backgroundColor: "#333", color: "#fff" }}
              >
                <option value="center">Center</option>
                <option value="smart">Smart</option>
              </select>
            </div>
          </div>
        );

      case "color_adjustment":
        return (
          <div className="mt-4">
            <Title level={4} style={{ color: "#ffffff" }}>
              Adjust HDR
            </Title>
            <Slider min={0} max={100} onChange={setHdr} value={hdr} />
          </div>
        );

      case "background_removal":
        return (
          <div className="mt-4">
            <label className="text-lg font-semibold" style={{ color: "#ffffff" }}>
              Background Removal
            </label>
            <Switch
              checked={backgroundRemoval}
              onChange={setBackgroundRemoval}
              className="ml-2"
            />
          </div>
        );

      case "object_detection":
        return (
          <div className="mt-4">
            <label className="text-lg font-semibold" style={{ color: "#ffffff" }}>
              Object Detection
            </label>
            <Switch
              checked={objectDetection}
              onChange={setObjectDetection}
              className="ml-2"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 p-8 min-h-screen w-screen">
      <Title level={2} style={{ color: "#ffffff" }}>
        AI-Powered Image Operations
      </Title>
      <Paragraph style={{ color: "#aaaaaa" }}>
        Upload an image and choose your desired operation:
      </Paragraph>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4 bg-white p-2 border rounded-lg cursor-pointer shadow-md"
      />

      {image && (
        <div className="flex flex-col items-center mt-4">
          <Paragraph style={{ color: "#ffffff" }}>
            Uploaded File: {image.name}
          </Paragraph>
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded Preview"
            className="mt-2 mb-4 w-48 h-48 object-cover border rounded-lg shadow-lg"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
            {[
              "restoration",
              "resizing",
              "color_adjustment",
              "background_removal",
              "object_detection",
            ].map((op) => (
              <Button
                key={op}
                onClick={() => setOperation(op)}
                className="p-4 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200 ease-in-out"
              >
                {op.charAt(0).toUpperCase() + op.slice(1).replace(/_/g, " ")}
              </Button>
            ))}
          </div>

          {renderOptions()}

          <Button
            type="primary"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold mt-6 py-2 px-4 rounded-lg transition duration-200 ease-in-out"
            onClick={() => {
              message.info("Processing image...");
            }}
          >
            Process Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
