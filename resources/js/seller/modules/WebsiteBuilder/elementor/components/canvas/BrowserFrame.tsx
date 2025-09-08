import React from 'react';

interface BrowserFrameProps {
  children: React.ReactNode;
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  websiteUrl?: string;
}

export function BrowserFrame({ children, devicePreview, websiteUrl }: BrowserFrameProps) {
  const getFrameStyles = () => {
    switch (devicePreview) {
      case 'mobile':
        return {
          maxWidth: '375px',
          borderRadius: '30px',
          padding: '8px',
          background: '#1f2937'
        };
      case 'tablet':
        return {
          maxWidth: '768px',
          borderRadius: '20px',
          padding: '6px',
          background: '#1f2937'
        };
      default: // desktop
        return {
          maxWidth: '100%',
          borderRadius: '10px',
          padding: '4px',
          background: '#e5e7eb'
        };
    }
  };

  const frameStyles = getFrameStyles();

  if (devicePreview === 'mobile') {
    return (
      <div className="mx-auto" style={{ maxWidth: frameStyles.maxWidth }}>
        <div 
          className="shadow-2xl"
          style={{
            borderRadius: frameStyles.borderRadius,
            padding: frameStyles.padding,
            background: frameStyles.background
          }}
        >
          {/* iPhone status bar */}
          <div className="flex items-center justify-between mb-2 px-4 text-white text-xs">
            <div className="flex items-center space-x-1">
              <span>9:41</span>
            </div>
            <div className="w-6 h-3 bg-black rounded-full"></div>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-0.5">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
              <div className="w-6 h-3 border border-white rounded-sm">
                <div className="w-4 h-2 bg-white rounded-sm mx-auto mt-0.5"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[22px] overflow-hidden shadow-inner">
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (devicePreview === 'tablet') {
    return (
      <div className="mx-auto" style={{ maxWidth: frameStyles.maxWidth }}>
        <div 
          className="shadow-2xl"
          style={{
            borderRadius: frameStyles.borderRadius,
            padding: frameStyles.padding,
            background: frameStyles.background
          }}
        >
          {/* iPad home button */}
          <div className="flex justify-center mb-3">
            <div className="w-8 h-8 border-2 border-gray-500 rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-[16px] overflow-hidden shadow-inner">
            {children}
          </div>
          
          <div className="flex justify-center mt-3">
            <div className="w-8 h-8 border-2 border-gray-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Safari frame
  return (
    <div className="mx-auto max-w-none">
      <div 
        className="shadow-xl"
        style={{
          borderRadius: frameStyles.borderRadius,
          padding: frameStyles.padding,
          background: frameStyles.background
        }}
      >
        {/* Safari top bar */}
        <div className="bg-white rounded-t-[6px] px-4 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {/* Traffic light buttons */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"></div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex items-center space-x-3">
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {/* Address bar */}
            <div className="flex-1 mx-4">
              <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">
                    {websiteUrl || 'https://your-website.com'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Safari buttons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-b-[6px] overflow-hidden shadow-inner">
          {children}
        </div>
      </div>
    </div>
  );
}