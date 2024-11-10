import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../Components/Loading';
import { subscribeToDocument } from '../../utils/appwrite';
import { Models } from 'appwrite';

const Result = () => {
  const { id } = useParams<{ id: string }>();  // File ID from URL params
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const navigate = useNavigate();  // Navigate function
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null);
  const [objectImageUrl, setObjectImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/');
    }

    // Define the handler for subscription updates
    const handleUpdate = (payload: Models.Document) => {
      if (payload && payload.output_image_url && payload.object_image_url) {
        setOutputImageUrl(payload.output_image_url);
        setObjectImageUrl(payload.object_image_url);
        setLoading(false);
      }
    };

    // Subscribing to document changes
    const unsubscribe = subscribeToDocument({
      documentID: id!,
      onUpdate: handleUpdate,
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className='bg-gray-900 h-screen w-screen'>
        <Loading />
      </div>
    );
  }

  return (
    <div className='bg-gray-900 h-screen w-screen flex items-center justify-center'>
      <div className='max-w-lg mx-auto'>
        {outputImageUrl && (
          <img
            src={outputImageUrl}
            alt="Output"
            className="mb-4"
          />
        )}
        {objectImageUrl && (
          <img
            src={objectImageUrl}
            alt="Object"
          />
        )}
      </div>
    </div>
  );
};

export default Result;
