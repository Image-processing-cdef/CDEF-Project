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
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Color Adjustments</h2>
      <div className="mb-4">
        <label className="mr-2">HDR Level:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={operations.adjustments.hdr || "50"}
          onChange={(e) => handleAdjustmentChange(Number(e.target.value))}
          className="bg-gray-800 border border-gray-700 rounded p-2 w-1/2"
        />
      </div>
    </div>
  );
};

export default AdjustmentsTab;