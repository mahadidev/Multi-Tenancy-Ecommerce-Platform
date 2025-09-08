import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WebsiteBuilderPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to CG Builder
    navigate('/cg-builder', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to CG Builder...</p>
      </div>
    </div>
  );
};

export default WebsiteBuilderPage;