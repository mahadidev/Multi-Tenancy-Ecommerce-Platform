import React, { useCallback, useState } from 'react';
import { useFileManagement } from '../hooks';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedBlob: Blob) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  onCropComplete,
}) => {
  const { getCroppedImg } = useFileManagement();
  const [crop] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const handleCropComplete = useCallback(async () => {
    const image = new Image();
    image.src = imageUrl;

    image.onload = async () => {
      const croppedBlob = await getCroppedImg({ image, crop });
      if (croppedBlob && onCropComplete) {
        onCropComplete(croppedBlob as Blob);
      }
    };
  }, [imageUrl, crop, getCroppedImg, onCropComplete]);

  return (
    <div className="image-cropper">
      <div className="cropper-container">
        <img src={imageUrl} alt="Crop preview" />
        {/* Crop overlay would go here in a real implementation */}
      </div>

      <div className="crop-controls">
        <button onClick={handleCropComplete}>
          Apply Crop
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
