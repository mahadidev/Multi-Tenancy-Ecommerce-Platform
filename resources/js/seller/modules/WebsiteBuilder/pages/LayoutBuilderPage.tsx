import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutBuilder } from '../components/LayoutBuilder';
import useStore from '@seller/_hooks/useStore';

export function LayoutBuilderPage() {
  const navigate = useNavigate();
  const { store } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial type from URL params, default to 'header'
  const initialType = (searchParams.get('type') as 'header' | 'footer') || 'header';
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>('');

  // For now, we'll use the store's website if available
  const websiteId = store?.website?.id?.toString() || '1';

  const handleSave = (layoutData: any) => {
    console.log(`${initialType} saved:`, layoutData);
    // Show success message or handle the save result
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <button
                onClick={() => navigate('/websites')}
                className="hover:text-gray-700 transition-colors"
              >
                Website Builder
              </button>
              <span>/</span>
              <span className="text-gray-900">Layout Builder</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              Layout Builder
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Design your website header and footer with drag-and-drop elements
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/websites')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Back to Websites
            </button>
            
            <button
              onClick={() => {
                if (store?.website?.subdomain) {
                  window.open(`/preview?subdomain=${store.website.subdomain}`, '_blank');
                }
              }}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
              disabled={!store?.website?.subdomain}
            >
              Preview Website
            </button>
          </div>
        </div>
      </div>

      {/* Layout Builder */}
      <div className="flex-1 overflow-hidden">
        <LayoutBuilder
          websiteId={websiteId}
          type={initialType}
          onSave={handleSave}
          showChoiceScreen={true}
        />
      </div>
    </div>
  );
}