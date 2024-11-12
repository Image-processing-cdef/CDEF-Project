import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../../Components/Loading";
import { Models } from "appwrite";
import { client, collectionID, databaseID } from "../../utils/appwrite";
import { imageCleanup } from "../../utils/appwrite";

const Result = () => {
  const { id } = useParams<{ id: string }>(); // File ID from URL params
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const navigate = useNavigate(); // Navigate function
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null);
  const [objectImageUrl, setObjectImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${databaseID}.collections.${collectionID}.documents.${id}`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          console.log("Document is updated");

          const payload = response.payload as Models.Document;

          if (payload.progress_state === "completed") {
            console.log("Document is completed");
            setOutputImageUrl(payload.output_image_url);
            setObjectImageUrl(payload.output_object_url);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      unsubscribe();
      // Call cleanup function on unmount
    };
  }, []);

  const handleTryAnother = () => {
    imageCleanup(id!); // Cleanup before redirecting
    navigate("/");
  };

  // Function to handle download by fetching the image as a blob
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up the object URL after download
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 h-screen w-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen lg:w-screen w-full flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row items-center lg:space-x-8">
          {outputImageUrl && (
            <div className="mb-4 lg:mb-0 lg:w-1/2 w-full">
              <h2 className="text-white text-xl font-semibold mb-2">Enhanced Image</h2>
              <img
                src={outputImageUrl}
                alt="Output"
                className="w-full h-auto rounded-md shadow-lg mb-2"
              />
              <button
                onClick={() => handleDownload(outputImageUrl, "enhanced_image.jpg")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full lg:w-auto text-center"
              >
                Download Enhanced Image
              </button>
            </div>
          )}
          {objectImageUrl && objectImageUrl !== "none" && (
            <div className="mb-4 lg:mb-0 lg:w-1/2 w-full">
              <h2 className="text-white text-xl font-semibold mb-2">Object Detection</h2>
              <img
                src={objectImageUrl}
                alt="Object"
                className="w-full h-auto rounded-md shadow-lg mb-2"
              />
              <button
                onClick={() => handleDownload(objectImageUrl, "object_detection_image.jpg")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-full lg:w-auto text-center"
              >
                Download Object Detection Image
              </button>
            </div>
          )}
        </div>
        <div className="mt-6">
          <button
            onClick={handleTryAnother}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
          >
            Try Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
