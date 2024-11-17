import React from 'react';
import { Operations, image_compression_type } from "../../types/image_operations";

interface ImageCompressionTabProps {
  operations: Operations;
  handleImageCompressionChange: (value: image_compression_type) => void;
}

const ImageCompressionTab: React.FC<ImageCompressionTabProps> = ({
  operations,
  handleImageCompressionChange,
}) => {
  return (
    <div className="mb-6 flex flex-col justify-center items-center text-center w-full space-y-6">
      <h2 className="text-xl font-semibold text-gray-200">Image Compression</h2>

      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        <div className="flex flex-col space-y-2 w-full">
          <label className="text-gray-300">Compression Type:</label>
          <select
            onChange={(e) =>
              handleImageCompressionChange(e.target.value as image_compression_type)
            }
            value={operations.image_compression}
            className="bg-gray-800 border border-gray-700 rounded p-3 w-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressionTab;
