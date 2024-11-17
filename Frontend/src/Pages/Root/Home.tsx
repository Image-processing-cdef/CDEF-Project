import React, { useState } from "react";
import {
  Operations,
  defaultOperations,
  image_compression_type,
  upscale_type,
} from "../../types/image_operations";
import { saveImage } from "../../utils/appwrite";
import { AdjustmentsTab , BackgroundRemovalTab , ImageCompressionTab, ObjectDetectionTab , ResizingTab , RestorationTab } from "../../Components/Tabs";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [operations, setOperations] = useState<Operations>(defaultOperations);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      image_compression: upscale !== 'none' || !polish ? 'none' : prev.image_compression
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
      restoration: { ...prev.restoration, upscale: value !== 'none' ? 'none' : prev.restoration.upscale, polish: value !== 'none' ? false : prev.restoration.polish },
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
      // Attempt to save the image and process it
      const id = await saveImage(operations, image!);
  
      if (id) {
        // Redirect to /result/{id} after successful image processing
        navigate(`/result/${id}`);
      } else {
        setSubmitError("An error occurred while processing the image.");
      }
    } catch (error) {
      // Catch any errors thrown during the saveImage process
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
    <div className="bg-gray-900 text-white min-h-screen w-screen flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold mb-6">Image Processing Operations</h1>

      <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleImageUpload}
        className="bg-gray-800 border border-gray-700 rounded p-2 mb-4 w-1/2"
      />
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {imagePreview && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Image Preview:</h3>
          <img src={imagePreview} alt="Preview" className="mt-2 rounded" />
        </div>
      )}

      {imagePreview && (
        <div>
          <div className="mb-4 flex space-x-2">
            <button
              className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${
                activeTab === "restoration" ? "bg-purple-600" : ""
              }`}
              onClick={() => setActiveTab("restoration")}
            >
              Restoration
            </button>
            <button
              className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${
                activeTab === "resizing" ? "bg-purple-600" : ""
              }`}
              onClick={() => setActiveTab("resizing")}
            >
              Resizing
            </button>
            <button
              className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${
                activeTab === "adjustments" ? "bg-purple-600" : ""
              }`}
              onClick={() => setActiveTab("adjustments")}
            >
              Color Adjustments
            </button>
            <button
              className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${
                activeTab === "backgroundRemoval" ? "bg-purple-600" : ""
              }`}
              onClick={() => setActiveTab("backgroundRemoval")}
            >
              Background Removal
            </button>
            <button
              className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${
                activeTab === "objectDetection" ? "bg-purple-600" : ""
              }`}
              onClick={() => setActiveTab("objectDetection")}
            >
              Object Detection
            </button>
            <button
              className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${
                activeTab === "imageCompression" ? "bg-purple-600" : ""
              }`}
              onClick={() => setActiveTab("imageCompression")}
            >
              Image Compression
            </button>
          </div>

          {renderActiveTab()}

          <button
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
          {submitError && (
            <div className="text-red-400 mt-4">{submitError}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;