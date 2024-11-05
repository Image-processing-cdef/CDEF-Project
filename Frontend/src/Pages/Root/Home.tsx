import React, { useState } from 'react';
import { Operations, defaultOperations, upscale_type } from '../../types/image_operations';
import { saveImage } from '../../utils/appwrite';

const Home: React.FC = () => {
    const [operations, setOperations] = useState<Operations>(defaultOperations);
    const [activeTab, setActiveTab] = useState<string>('upload');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [imageID , setImageID] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const isValid = /\.(jpe?g|png)$/i.test(file.name);
            if (!isValid) {
                setError('Please upload a valid image file (.jpeg or .png).');
                setImage(null);
                setImagePreview(null);
                return;
            }
            setError(null);
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    

    const handleRestorationChange = (upscale: upscale_type, polish: boolean) => {
        setOperations((prev: Operations) => ({
            ...prev,
            restoration: { ...prev.restoration, upscale, polish },
        }));
    };

    const handleResizingChange = (
        width: string,
        height: string,
        smartCropping: 'none' | 'smart' | 'center'
    ) => {
        setOperations((prev) => ({
            ...prev,
            resizing: {
                ...prev.resizing,
                width,
                height,
                smart_cropping: smartCropping,
            },
        }));
    };

    const handleAdjustmentChange = (hdr: number) => {
        setOperations((prev: Operations) => ({
            ...prev,
            adjustments: { ...prev.adjustments, hdr },
        }));
    };

    const handleBackgroundRemovalChange = (value: boolean) => {
        setOperations((prev: Operations) => ({
            ...prev,
            background_removal: value,
        }));
    };

    const handleObjectDetectionChange = (value: boolean) => {
        setOperations((prev: Operations) => ({
            ...prev,
            object_detection: value,
        }));
    };

    const handleSubmit = () => {
        // Check if any operation has been selected
        const hasSelectedOperation = Object.values(operations).some((operation) =>
            typeof operation === 'object' ? Object.values(operation).some(Boolean) : Boolean(operation)
        );

        if (!hasSelectedOperation) {
            setSubmitError('Please select at least one operation before submitting.');
            return;
        }

        setSubmitError(null);

        // Saving image metadata and storing bucket , invoking the serverless function in the backend.
        const id = saveImage(operations, image!);
        setImageID(id!);

        
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen w-screen flex flex-col items-center justify-center py-10">
            <h1 className="text-4xl font-bold mb-6">Image Processing Operations</h1>

            <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
            <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageUpload}
                className="bg-gray-800 border border-gray-700 rounded p-2 mb-4 w-1/2"
            />
            {error && <div className="text-red-400 mb-4">{error}</div>}
            {imagePreview && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Image Preview:</h3>
                    <img src={imagePreview} alt="Preview" className="mt-2 rounded" />
                </div>
            )}

            {imagePreview && (
                <div>
                    <div className="mb-4 flex space-x-2">
                        <button
                            className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${activeTab === 'restoration' ? 'bg-purple-600' : ''}`}
                            onClick={() => setActiveTab('restoration')}
                        >
                            Restoration
                        </button>
                        <button
                            className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${activeTab === 'resizing' ? 'bg-purple-600' : ''}`}
                            onClick={() => setActiveTab('resizing')}
                        >
                            Resizing
                        </button>
                        <button
                            className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${activeTab === 'adjustments' ? 'bg-purple-600' : ''}`}
                            onClick={() => setActiveTab('adjustments')}
                        >
                            Color Adjustments
                        </button>
                        <button
                            className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${activeTab === 'backgroundRemoval' ? 'bg-purple-600' : ''}`}
                            onClick={() => setActiveTab('backgroundRemoval')}
                        >
                            Background Removal
                        </button>
                        <button
                            className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded ${activeTab === 'objectDetection' ? 'bg-purple-600' : ''}`}
                            onClick={() => setActiveTab('objectDetection')}
                        >
                            Object Detection
                        </button>
                    </div>

                    {/* Restoration Tab */}
                    {activeTab === 'restoration' && (
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
                                    value={operations.restoration.upscale || 'none'}
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
                    )}

                    {/* Resizing Tab */}
                    {activeTab === 'resizing' && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Resizing Options</h2>
                            <div className="mb-4">
                                <label className="mr-2">Width:</label>
                                <input
                                    type="text"
                                    value={operations.resizing.width || ''}
                                    onChange={(e) =>
                                        handleResizingChange(
                                            e.target.value,
                                            operations.resizing.height,
                                            operations.resizing.smart_cropping as 'none' | 'smart' | 'center'
                                        )
                                    }
                                    className="bg-gray-800 border border-gray-700 rounded p-2 w-1/2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="mr-2">Height:</label>
                                <input
                                    type="text"
                                    value={operations.resizing.height || ''}
                                    onChange={(e) =>
                                        handleResizingChange(
                                            operations.resizing.width,
                                            e.target.value,
                                            operations.resizing.smart_cropping as 'none' | 'smart' | 'center'
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
                                            e.target.value as 'none' | 'smart' | 'center'
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
                    )}

                    {/* Adjustments Tab */}
                    {activeTab === 'adjustments' && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Color Adjustments</h2>
                            <div className="mb-4">
                                <label className="mr-2">HDR Level:</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={operations.adjustments.hdr || '50'}
                                    onChange={(e) => handleAdjustmentChange(Number(e.target.value))}
                                    className="bg-gray-800 border border-gray-700 rounded p-2 w-1/2"
                                />
                            </div>
                        </div>
                    )}

                    {/* Background Removal Tab */}
                    {activeTab === 'backgroundRemoval' && (
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
                    )}

                    {/* Object Detection Tab */}
                    {activeTab === 'objectDetection' && (
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
                    )}

                    <button
                        className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    {submitError && <div className="text-red-400 mt-4">{submitError}</div>}
                </div>
            )}
        </div>
    );
};

export default Home;