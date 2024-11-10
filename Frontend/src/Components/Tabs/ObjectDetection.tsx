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
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Object Detection</h2>
      <div className="mb-4">
        <label className="mr-2">Detect Objects:</label>
        <input
          type="checkbox"
          checked={operations.object_detection}
          onChange={(e) => handleObjectDetectionChange(e.target.checked)}
          className="mr-2"
        />
        <span>Enable</span>
      </div>
    </div>
  );
};


export default ObjectDetectionTab;