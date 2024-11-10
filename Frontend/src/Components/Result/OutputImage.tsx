import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageCleanup } from '../../utils/appwrite';

interface OutputImageProps {
  outputImageUrl: string;
  objectImageUrl: string;
  file_id: string;
}

const OutputImage = ({ outputImageUrl, objectImageUrl, file_id }: OutputImageProps) => {
  const navigate = useNavigate();

  const cleanupImage = async () => {
    try {
      const response = await imageCleanup(file_id);
      if (response) {
        console.log('Image cleaned up successfully:', response);
      }
    } catch (error) {
      console.error('Error cleaning up image:', error);
    }
  };

  useEffect(() => {
    return () => {
      cleanupImage();
    };
  }, []);

  const handleRetry = () => {
    cleanupImage();
    navigate('/');
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg';
    link.click();
  };

  return (
    <div className='h-screen w-screen'>
      <div>
        <h3>Output Image</h3>
        <img src={outputImageUrl} alt="Output" width="300" height="300" />
        <button onClick={() => handleDownload(outputImageUrl)}>Download Output Image</button>
      </div>

      <div>
        <h3>Processed Object Image</h3>
        <img src={objectImageUrl} alt="Object" width="300" />
        <button onClick={() => handleDownload(objectImageUrl)}>Download Object Image</button>
      </div>

      <div>
        <button onClick={handleRetry}>Retry</button>
      </div>
    </div>
  );
};

export default OutputImage;
