import React from 'react';

interface ElementorTopBarProps {
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  setDevicePreview: (device: 'desktop' | 'tablet' | 'mobile') => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (preview: boolean) => void;
  onSave: () => void;
  onExit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showNavigator: boolean;
  setShowNavigator: (show: boolean) => void;
}

const DeviceIcon = ({ device }: { device: 'desktop' | 'tablet' | 'mobile' }) => {
  switch (device) {
    case 'desktop':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm12 8a1 1 0 100 2h-3.586l2.293 2.293a1 1 0 01-1.414 1.414L10 15.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 14H5a1 1 0 100-2h10z" clipRule="evenodd" />
        </svg>
      );
    case 'tablet':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v8H5V5zm2 10a1 1 0 100 2h6a1 1 0 100-2H7z" />
        </svg>
      );
    case 'mobile':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm0 2h6v12H7V4zm2 14a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
        </svg>
      );
  }
};

export function ElementorTopBar({
  devicePreview,
  setDevicePreview,
  isPreviewMode,
  setIsPreviewMode,
  onSave,
  onExit,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  showNavigator,
  setShowNavigator
}: ElementorTopBarProps) {
  return (
    <div className="h-14 bg-[#495057] border-b border-gray-700 flex items-center justify-between px-4 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Elementor Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#71d7f7] rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white font-semibold text-lg">Elementor</span>
        </div>

        <div className="w-px h-6 bg-gray-600"></div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded hover:bg-gray-600 transition-colors ${
              canUndo ? 'text-white' : 'text-gray-500 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded hover:bg-gray-600 transition-colors ${
              canRedo ? 'text-white' : 'text-gray-500 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-600 mx-2"></div>

          <button
            onClick={() => setShowNavigator(!showNavigator)}
            className={`p-2 rounded hover:bg-gray-600 transition-colors ${
              showNavigator ? 'bg-gray-600 text-[#71d7f7]' : 'text-white'
            }`}
            title="Navigator"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Center Section - Device Preview */}
      <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
        {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
          <button
            key={device}
            onClick={() => setDevicePreview(device)}
            className={`p-2 rounded-md transition-colors ${
              devicePreview === device
                ? 'bg-[#71d7f7] text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
            title={`${device.charAt(0).toUpperCase() + device.slice(1)} Preview`}
          >
            <DeviceIcon device={device} />
          </button>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Preview Mode Toggle */}
        <button
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            isPreviewMode
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {isPreviewMode ? 'Exit Preview' : 'Preview'}
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          className="px-4 py-2 bg-[#61ce70] hover:bg-[#4cae4c] text-white rounded text-sm font-medium transition-colors"
          title="Save Changes (Ctrl+S)"
        >
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Update</span>
          </div>
        </button>

        {/* Settings Button */}
        <button
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-colors"
          title="Page Settings"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Menu Button */}
        <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-600"></div>

        {/* Exit Button */}
        <button
          onClick={onExit}
          className="p-2 text-gray-300 hover:text-red-400 hover:bg-gray-600 rounded transition-colors"
          title="Exit Elementor"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}