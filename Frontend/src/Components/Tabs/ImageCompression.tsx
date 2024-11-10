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
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Image Compression</h2>
      <div className="mb-4">
        <label className="mr-2">Type</label>
        <select
          onChange={(e) =>
            handleImageCompressionChange(
              e.target.value as "none" | "low" | "medium" | "high"
            )
          }
          value={operations.image_compression}
          className="bg-gray-800 border border-gray-700 rounded p-2 w-1/2"
        >
          <option value="none">None</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
};

export default ImageCompressionTab;