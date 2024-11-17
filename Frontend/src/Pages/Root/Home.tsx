import React, { useState, useEffect, useRef } from "react";
import {
  Operations,
  defaultOperations,
  image_compression_type,
  upscale_type,
} from "../../types/image_operations";
import { saveImage } from "../../utils/appwrite";
import {
  AdjustmentsTab,
  BackgroundRemovalTab,
  ImageCompressionTab,
  ObjectDetectionTab,
  ResizingTab,
  RestorationTab,
} from "../../Components/Tabs";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [operations, setOperations] = useState<Operations>(defaultOperations);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawPattern = (x: number, y: number, size: number = 15) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const xOffset = x + size * Math.cos(angle);
        const yOffset = y + size * Math.sin(angle);
        ctx.lineTo(xOffset, yOffset);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const drawBackground = () => {
      ctx.fillStyle = "#0b141a"; // Dark green background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#415d53"; // Subtle green for doodles
      for (let i = 20; i < canvas.width; i += 60) {
        for (let j = 20; j < canvas.height; j += 60) {
          drawPattern(i, j, Math.random() * 10 + 5);
        }
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawBackground();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isValid = /\.(jpe?g|png)$/i.test(file.name);
      if (!isValid) {
        setError("Please upload a valid image file (.jpeg or .png).");
        setImage(null);
        setImagePreview(null);
        return;
      }
      setError(null);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRestorationChange = (upscale: upscale_type, polish: boolean) => {
    setOperations((prev: Operations) => ({
      ...prev,
      restoration: { ...prev.restoration, upscale, polish },
      image_compression:
        upscale !== "none" || !polish ? "none" : prev.image_compression,
    }));
  };

  const handleResizingChange = (
    width: string,
    height: string,
    smartCropping: "none" | "smart" | "center"
  ) => {
    setOperations((prev) => ({
      ...prev,
      resizing: {
        ...prev.resizing,
        width,
        height,
        smart_cropping: smartCropping,
      },
    }));
  };

  const handleAdjustmentChange = (hdr: number) => {
    setOperations((prev: Operations) => ({
      ...prev,
      adjustments: { ...prev.adjustments, hdr },
    }));
  };

  const handleBackgroundRemovalChange = (value: boolean) => {
    setOperations((prev: Operations) => ({
      ...prev,
      background_removal: value,
    }));
  };

  const handleObjectDetectionChange = (value: boolean) => {
    setOperations((prev: Operations) => ({
      ...prev,
      object_detection: value,
    }));
  };

  const handleImageCompressionChange = (value: image_compression_type) => {
    setOperations((prev: Operations) => ({
      ...prev,
      image_compression: value,
      restoration: {
        ...prev.restoration,
        upscale: value !== "none" ? "none" : prev.restoration.upscale,
        polish: value !== "none" ? false : prev.restoration.polish,
      },
    }));
  };

  const handleSubmit = async () => {
    const hasSelectedOperation = Object.values(operations).some((operation) =>
      typeof operation === "object"
        ? Object.values(operation).some(Boolean)
        : Boolean(operation)
    );

    if (!hasSelectedOperation) {
      setSubmitError("Please select at least one operation before submitting.");
      return;
    }

    setSubmitError(null);

    try {
      const id = await saveImage(operations, image!);

      if (id) {
        navigate(`/result/${id}`);
      } else {
        setSubmitError("An error occurred while processing the image.");
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again.");
      console.error("Error during image processing:", error);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "restoration":
        return (
          <RestorationTab
            operations={operations}
            handleRestorationChange={handleRestorationChange}
          />
        );
      case "resizing":
        return (
          <ResizingTab
            operations={operations}
            handleResizingChange={handleResizingChange}
          />
        );
      case "adjustments":
        return (
          <AdjustmentsTab
            operations={operations}
            handleAdjustmentChange={handleAdjustmentChange}
          />
        );
      case "backgroundRemoval":
        return (
          <BackgroundRemovalTab
            operations={operations}
            handleBackgroundRemovalChange={handleBackgroundRemovalChange}
          />
        );
      case "objectDetection":
        return (
          <ObjectDetectionTab
            operations={operations}
            handleObjectDetectionChange={handleObjectDetectionChange}
          />
        );
      case "imageCompression":
        return (
          <ImageCompressionTab
            operations={operations}
            handleImageCompressionChange={handleImageCompressionChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-auto">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{
          zIndex: -1,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div className="bg-transparent text-gray-200 min-h-screen flex flex-col items-center justify-start py-10 w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">Image Processing Operations</h1>

        <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleImageUpload}
          className="bg-[#1c2b2f] border border-gray-700 rounded p-2 mb-4 w-4/5 sm:w-1/2 text-gray-300"
        />
        {error && <div className="text-red-400 mb-4">{error}</div>}
        {imagePreview && (
          <div className="mb-4 max-md:p-3">
            <h3 className="text-lg font-semibold">Image Preview:</h3>
            <img src={imagePreview} alt="Preview" className="mt-2 rounded max-h-[40rem] w-auto object-contain" />
          </div>
        )}

        {imagePreview && (
          <div>
            <div className="mb-4 flex flex-wrap justify-center space-x-2 max-md:p-3">
              {["restoration", "resizing", "adjustments", "backgroundRemoval", "objectDetection", "imageCompression"].map((tab) => (
                <button
                  key={tab}
                  className={`bg-[#1c2b2f] hover:bg-[#273a3d] text-gray-200 py-2 px-4 rounded mb-2 ${
                    activeTab === tab ? "bg-green-600" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {renderActiveTab()}
          </div>
        )}

        {submitError && <div className="text-red-500 mt-4">{submitError}</div>}
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white py-2 px-4 rounded mt-6 hover:bg-green-600"
        >
          Process Image
        </button>
      </div>
    </div>
  );
};

export default Home;
