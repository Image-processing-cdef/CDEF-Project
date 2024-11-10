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
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Restoration Options</h2>
      <div className="mb-4">
        <label className="mr-2">Upscale:</label>
        <select
          onChange={(e) =>
            handleRestorationChange(
              e.target.value as upscale_type,
              operations.restoration.polish
            )
          }
          value={operations.restoration.upscale || "none"}
          className="bg-gray-800 border border-gray-700 rounded p-2 w-1/2"
        >
          <option value="none">None</option>
          <option value="smart_enhance">Smart Enhance</option>
          <option value="digital_art">Digital Art</option>
          <option value="smart_resize">Smart Resize</option>
          <option value="photo">Photo</option>
          <option value="faces">Faces</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="mr-2">Polish:</label>
        <input
          type="checkbox"
          checked={operations.restoration.polish}
          onChange={(e) =>
            handleRestorationChange(
              operations.restoration.upscale,
              e.target.checked
            )
          }
          className="mr-2"
        />
        <span>Apply Polish</span>
      </div>
    </div>
  );
};

export default RestorationTab;