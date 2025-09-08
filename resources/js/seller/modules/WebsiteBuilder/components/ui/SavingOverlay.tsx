import React from 'react';

interface SavingOverlayProps {
  isVisible: boolean;
  layoutMode?: 'header' | 'footer';
}

export function SavingOverlay({ isVisible, layoutMode }: SavingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <div>
            <p className="text-gray-900 font-medium">
              {layoutMode ? `Saving ${layoutMode}...` : 'Saving page...'}
            </p>
            <p className="text-gray-600 text-sm">Please wait while we save your changes</p>
          </div>
        </div>
      </div>
    </div>
  );
}