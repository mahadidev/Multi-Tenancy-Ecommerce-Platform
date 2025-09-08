import React from 'react';

interface LayoutBuilderHeaderProps {
  layoutType: 'header' | 'footer';
  onBack: () => void;
  onLayoutTypeChange: (type: 'header' | 'footer') => void;
}

export function LayoutBuilderHeader({ 
  layoutType, 
  onBack, 
  onLayoutTypeChange 
}: LayoutBuilderHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Back to CG Builder"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        <div className="h-6 w-px bg-gray-300"></div>
        
        <h1 className="text-sm font-medium text-gray-900">Layout Builder</h1>
      </div>

      {/* Layout Type Toggle */}
      <div className="flex items-center space-x-2">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => onLayoutTypeChange('header')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              layoutType === 'header'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Header
          </button>
          <button
            onClick={() => onLayoutTypeChange('footer')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              layoutType === 'footer'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Footer
          </button>
        </div>
      </div>
    </div>
  );
}