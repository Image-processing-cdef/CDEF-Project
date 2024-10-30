import { ID, Models } from "appwrite";
import { storage } from "../../utils/appwrite";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Home() {
    const [image, setImage] = useState<File | null>(null);
    const [operation, setOperation] = useState<string>("compression");
    const [fileId, setFileId] = useState<string | null>(null);
  
    // Handle file input change
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };
  
    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
  
        if (!image) {
            alert("Please select an image to upload.");
            return;
        }
  
        try {
            // Upload image file
            const response = await storage.createFile(
                import.meta.env.VITE_APPWRITE_BUCKET,  // ID of the Appwrite storage bucket
                ID.unique(),        // Generate a unique ID for the file
                image              // File to upload
            ) as Models.File;
            // Store operation type separately (e.g., in a database) or handle in backend function
            console.log("Image uploaded:", response);
            setFileId(response.$id);
            alert("Image uploaded successfully! Processing will start shortly.");
  
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image. Please try again.");
        }
    };
  
    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                    <option value="compression">Compress</option>
                    <option value="upscaling">Upscale</option>
                </select>
                <button type="submit">Upload Image</button>
            </form>
            {fileId && <p>Uploaded File ID: {fileId}</p>}
        </div>
    );
  }
