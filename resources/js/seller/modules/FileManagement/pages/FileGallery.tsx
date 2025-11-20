import React from 'react';
import { useFileManagement } from '../hooks';

const FileGallery: React.FC = () => {
  const { files, delete: deleteFile } = useFileManagement();

  return (
    <div className="file-gallery">
      <div className="file-gallery-header">
        <h2>File Gallery</h2>
      </div>

      <div className="file-gallery-grid">
        {files.map((file) => (
          <div key={file.id} className="file-item">
            {file.type === 'image' ? (
              <img src={file.url} alt={file.alternate_text || file.name} />
            ) : (
              <div className="file-icon">
                <span>{file.type}</span>
              </div>
            )}
            <div className="file-info">
              <p>{file.name}</p>
              <button onClick={() => deleteFile.submit({ formData: { id: file.id } })}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileGallery;
