import React from 'react';
import { Operations, upscale_type } from "../../types/image_operations";

interface RestorationTabProps {
  operations: Operations;
  handleRestorationChange: (upscale: upscale_type, polish: boolean) => void;
}

const RestorationTab: React.FC<RestorationTabProps> = ({
  operations,
  handleRestorationChange,
}) => {
  return (
    <div className="mb-6 flex flex-col justify-center items-center text-center w-full space-y-6">
      <h2 className="text-xl font-semibold text-gray-200">Restoration Options</h2>
      
      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        <div className="flex flex-col space-y-2 w-full">
          <label className="text-gray-300">Upscale:</label>
          <select
            onChange={(e) =>
              handleRestorationChange(
                e.target.value as upscale_type,
                operations.restoration.polish
              )
            }
            value={operations.restoration.upscale || "none"}
            className="bg-gray-800 border border-gray-700 rounded p-3 w-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="none">None</option>
            <option value="smart_enhance">Smart Enhance</option>
            <option value="digital_art">Digital Art</option>
            <option value="smart_resize">Smart Resize</option>
            <option value="photo">Photo</option>
            <option value="faces">Faces</option>
          </select>
        </div>

        <div className="flex items-center space-x-4 w-full justify-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={operations.restoration.polish}
              onChange={(e) =>
                handleRestorationChange(
                  operations.restoration.upscale,
                  e.target.checked
                )
              }
              className="hidden"
            />
            <div
              className={`w-12 h-6 rounded-full relative transition-all duration-300 ease-in-out ${
                operations.restoration.polish ? 'bg-green-600' : 'bg-gray-700'
              }`}
            >
              <div
                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ease-in-out ${
                  operations.restoration.polish ? 'transform translate-x-6' : ''
                }`}
              ></div>
            </div>
            <span className="text-gray-300 ml-2">Apply Polish</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default RestorationTab;
