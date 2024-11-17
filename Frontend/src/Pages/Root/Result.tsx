import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../../Components/Loading";
import { Models } from "appwrite";
import {
  client,
  collectionID,
  databaseID,
  fetchImageStatus,
  imageCleanup,
} from "../../utils/appwrite";

const fetchImage = async (id: string): Promise<Models.Document | null> => {
  try {
    const response = await fetchImageStatus(id);
    return response;
  } catch (error) {
    console.error("Error fetching image document:", error);
    return null;
  }
};

const Result = () => {
  const { id } = useParams<{ id: string }>(); // Get 'id' from URL params
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null);
  const [objectImageUrl, setObjectImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let intervalId: NodeJS.Timeout | null = null;
    let isCompleted = false; // Track if progress is already completed

    // Appwrite subscription listener
    const unsubscribe = client.subscribe(
      `databases.${databaseID}.collections.${collectionID}.documents.${id}`,
      (response) => {
        if (
          response.events.includes("databases.*.collections.*.documents.*.update")
        ) {
          const payload = response.payload as Models.Document;

          if (payload.progress_state === "completed") {
            console.log("Image processing completed via listener.");
            isCompleted = true; // Mark as completed
            if (timeoutId) clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);

            setOutputImageUrl(payload.output_image_url);
            setObjectImageUrl(payload.output_object_url);
            setLoading(false);
          }
        }
      }
    );

    // Fallback fetch logic
    const fetchDocumentFallback = async () => {
      if (isCompleted) return; // Avoid redundant calls if already completed
      try {
        console.log("Fallback initiated: Fetching the image document.");
        const document = await fetchImage(id!);
        if (document && document.progress_state === "completed") {
          console.log("Image processing completed via fallback.");
          isCompleted = true; // Mark as completed
          if (intervalId) clearInterval(intervalId);

          setOutputImageUrl(document.output_image_url);
          setObjectImageUrl(document.output_object_url);
          setLoading(false);
        }
      } catch (error) {
        console.error("Fallback fetch failed:", error);
      }
    };

    // Initial timeout to start fallback
    timeoutId = setTimeout(() => {
      if (isCompleted) return; // Avoid setting interval if already completed
      fetchDocumentFallback(); // Immediate call after 45 seconds
      intervalId = setInterval(fetchDocumentFallback, 10000); // Call every 10 seconds
    }, 45000);

    return () => {
      // Cleanup on unmount
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      unsubscribe();
    };
  }, [id]); // Add id as a dependency to re-run the effect

  const handleTryAnother = () => {
    imageCleanup(id!); // Cleanup before redirecting
    navigate("/"); // Navigate to the home page
  };

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
      URL.revokeObjectURL(link.href);
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
    <div className="bg-gray-900 min-h-screen w-screen flex flex-col items-center justify-center p-4">
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
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
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
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Download Object Detection Image
              </button>
            </div>
          )}
        </div>
        <div className="mt-6">
          <button
            onClick={handleTryAnother}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
