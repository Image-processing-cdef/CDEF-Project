import React from 'react';
import { Operations } from "../../types/image_operations";

interface BackgroundRemovalTabProps {
  operations: Operations;
  handleBackgroundRemovalChange: (value: boolean) => void;
}

const BackgroundRemovalTab: React.FC<BackgroundRemovalTabProps> = ({
  operations,
  handleBackgroundRemovalChange,
}) => {
  return (
    <div className="mb-6 flex flex-col justify-center items-center text-center w-full space-y-6">
      <h2 className="text-xl font-semibold text-gray-200">Background Removal</h2>
      
      <div className="flex items-center space-x-4 w-full justify-center">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={operations.background_removal}
            onChange={(e) => handleBackgroundRemovalChange(e.target.checked)}
            className="hidden"
          />
          <div
            className={`w-12 h-6 rounded-full relative transition-all duration-300 ease-in-out ${
              operations.background_removal ? 'bg-green-600' : 'bg-gray-700'
            }`}
          >
            <div
              className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ease-in-out ${
                operations.background_removal ? 'transform translate-x-6' : ''
              }`}
            ></div>
          </div>
          <span className="text-gray-300 ml-2">Enable Background Removal</span>
        </label>
      </div>
    </div>
  );
};

export default BackgroundRemovalTab;
