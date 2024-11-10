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
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Background Removal</h2>
      <div className="mb-4">
        <label className="mr-2">Remove Background:</label>
        <input
          type="checkbox"
          checked={operations.background_removal}
          onChange={(e) => handleBackgroundRemovalChange(e.target.checked)}
          className="mr-2"
        />
        <span>Enable</span>
      </div>
    </div>
  );
};

export default BackgroundRemovalTab;