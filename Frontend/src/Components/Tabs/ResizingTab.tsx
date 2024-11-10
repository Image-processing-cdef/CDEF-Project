import React from 'react';
import { Operations } from "../../types/image_operations";

interface ResizingTabProps {
  operations: Operations;
  handleResizingChange: (
    width: string,
    height: string,
    smartCropping: "none" | "smart" | "center"
  ) => void;
}

const ResizingTab: React.FC<ResizingTabProps> = ({
  operations,
  handleResizingChange,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Resizing Options</h2>
      <div className="mb-4">
        <label className="mr-2">Width:</label>
        <input
          type="text"
          value={operations.resizing.width || ""}
          onChange={(e) =>
            handleResizingChange(
              e.target.value,
              operations.resizing.height,
              operations.resizing.smart_cropping as "none" | "smart" | "center"
            )
          }
          className="bg-gray-800 border border-gray-700 rounded p-2 w-1/2"
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">Height:</label>
        <input
          type="text"
          value={operations.resizing.height || ""}
          onChange={(e) =>
            handleResizingChange(
              operations.resizing.width,
              e.target.value,
              operations.resizing.smart_cropping as "none" | "smart" | "center"
            )
          }
          className="bg-gray-800 border border-gray-700 rounded p-2 w-1/2"
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">Smart Cropping:</label>
        <select
          onChange={(e) =>
            handleResizingChange(
              operations.resizing.width,
              operations.resizing.height,
              e.target.value as "none" | "smart" | "center"
            )
          }
          value={operations.resizing.smart_cropping}
          className="bg-gray-800 border border-gray-700 rounded p-2 w-1/2"
        >
          <option value="none">None</option>
          <option value="smart">Smart</option>
          <option value="center">Center</option>
        </select>
      </div>
    </div>
  );
};

export default ResizingTab;
