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
    <div className="mb-6 flex flex-col justify-center items-center text-center w-full space-y-6">
      <h2 className="text-xl font-semibold text-gray-200">Resizing Options</h2>

      {/* Width Input */}
      <div className="flex flex-col items-center space-y-2 w-full max-w-md">
        <div className="flex flex-col space-y-2 w-full">
          <label className="text-gray-300">Width:</label>
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
            className="bg-gray-800 text-gray-300 border border-gray-700 rounded p-3 w-full transition-all duration-300 ease-in-out focus:ring-2 focus:ring-green-600 focus:outline-none"
          />
        </div>

        {/* Height Input */}
        <div className="flex flex-col space-y-2 w-full">
          <label className="text-gray-300">Height:</label>
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
            className="bg-gray-800 text-gray-300 border border-gray-700 rounded p-3 w-full transition-all duration-300 ease-in-out focus:ring-2 focus:ring-green-600 focus:outline-none"
          />
        </div>

        {/* Smart Cropping Dropdown */}
        <div className="flex flex-col space-y-2 w-full">
          <label className="text-gray-300">Smart Cropping:</label>
          <select
            onChange={(e) =>
              handleResizingChange(
                operations.resizing.width,
                operations.resizing.height,
                e.target.value as "none" | "smart" | "center"
              )
            }
            value={operations.resizing.smart_cropping}
            className="bg-gray-800 text-gray-300 border border-gray-700 rounded p-3 w-full transition-all duration-300 ease-in-out hover:bg-gray-700 focus:ring-2 focus:ring-green-600 focus:outline-none"
          >
            <option value="none">None</option>
            <option value="smart">Smart</option>
            <option value="center">Center</option>
          </select>
        </div>
      </div>

    </div>
  );
};

export default ResizingTab;
