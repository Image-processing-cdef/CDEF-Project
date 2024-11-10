import { useState, useEffect } from 'react';
import { Client } from 'appwrite';

const useStatusPolling = (file_id: string) => {
  const [status, setStatus] = useState<string>('initiated');
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null);
  const [objectImageUrl, setObjectImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Appwrite client and Realtime instance
    const client = new Client();
    

    // Subscribe to document updates using the file_id as the document ID
    const unsubscribe = client.subscribe(`documents.${file_id}`, (response: any) => {
      const doc = response.payload;
      const newStatus = doc.progress_state;
      
      setStatus(newStatus);

      if (newStatus === 'completed') {
        setOutputImageUrl(doc.output_image_url);
        setObjectImageUrl(doc.object_image_url);
      } else if (newStatus === 'error') {
        setError('Error processing the image.');
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [file_id]);

  return { status, outputImageUrl, objectImageUrl, error };
};

export default useStatusPolling;
