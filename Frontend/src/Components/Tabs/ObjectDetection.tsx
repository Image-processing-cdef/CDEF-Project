import React from 'react';
import { Operations } from "../../types/image_operations";

interface ObjectDetectionTabProps {
  operations: Operations;
  handleObjectDetectionChange: (value: boolean) => void;
}

const ObjectDetectionTab: React.FC<ObjectDetectionTabProps> = ({
  operations,
  handleObjectDetectionChange,
}) => {
  return (
    <div className="mb-6 flex flex-col justify-center items-center text-center w-full space-y-6">
      <h2 className="text-xl font-semibold text-gray-200">Object Detection</h2>
      
      <div className="flex items-center space-x-4 w-full justify-center">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={operations.object_detection}
            onChange={(e) => handleObjectDetectionChange(e.target.checked)}
            className="hidden"
          />
          <div
            className={`w-12 h-6 rounded-full relative transition-all duration-300 ease-in-out ${
              operations.object_detection ? 'bg-green-600' : 'bg-gray-700'
            }`}
          >
            <div
              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ease-in-out ${
                operations.object_detection ? 'transform translate-x-6' : ''
              }`}
            ></div>
          </div>
          <span className="text-gray-300 ml-2">Enable Object Detection</span>
        </label>
      </div>
    </div>
  );
};

export default ObjectDetectionTab;
