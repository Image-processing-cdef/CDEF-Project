import React from 'react';
import { Operations } from "../../types/image_operations";

interface AdjustmentsTabProps {
  operations: Operations;
  handleAdjustmentChange: (hdr: number) => void;
}

const AdjustmentsTab: React.FC<AdjustmentsTabProps> = ({
  operations,
  handleAdjustmentChange,
}) => {
  return (
    <div className="mb-6 flex flex-col justify-center items-center text-center w-full space-y-6">
      <h2 className="text-xl font-semibold text-gray-200">Color Adjustments</h2>
      
      {/* HDR Level Slider */}
      <div className="flex flex-col items-center space-y-2 w-full max-w-md">
        <div className="flex items-center space-x-4 w-full justify-between">
          <label className="text-gray-300">HDR Level:</label>
          
          {/* Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={operations.adjustments.hdr || 0}
            onChange={(e) => handleAdjustmentChange(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-lg w-full h-2 transition-all duration-300 ease-in-out focus:outline-none"
          />

          
          <span className="text-gray-300 font-semibold">{operations.adjustments.hdr || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentsTab;
