import React, { useCallback } from 'react';
import { useFileManagement } from '../hooks';

interface FileUploaderProps {
  onSuccess?: (file: any) => void;
  accept?: string;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onSuccess,
  accept = 'image/*',
  multiple = false,
}) => {
  const { upload } = useFileManagement();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      upload.submit({
        formData: {
          file,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          response_type: 'url',
        },
        onSuccess: (data: any) => {
          if (onSuccess) {
            onSuccess(data);
          }
        },
      });
    });
  }, [upload, onSuccess]);

  return (
    <div className="file-uploader">
      <input
        type="file"
        onChange={handleFileSelect}
        accept={accept}
        multiple={multiple}
        className="file-input"
      />

      {upload.isLoading && (
        <div className="upload-progress">
          <p>Uploading...</p>
        </div>
      )}

      {upload.isError && (
        <div className="upload-error">
          <p>Upload failed. Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
