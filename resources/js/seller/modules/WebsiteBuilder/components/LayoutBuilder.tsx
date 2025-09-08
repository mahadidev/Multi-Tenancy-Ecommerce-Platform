import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LayoutBuilderProps {
  websiteId: string;
  type?: 'header' | 'footer';
  onSave?: (layoutData: any) => void;
  showChoiceScreen?: boolean;
}

export function LayoutBuilder({ websiteId, type, onSave, showChoiceScreen = true }: LayoutBuilderProps) {
  const navigate = useNavigate();

  const builderOptions = [
    {
      id: 'header',
      title: 'Header Builder',
      description: 'Design and customize your website header with logos, navigation, and more',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        </svg>
      ),
      color: 'bg-gradient-to-br from-green-500 to-teal-600',
      route: '/cg-builder/header'
    },
    {
      id: 'footer',
      title: 'Footer Builder',
      description: 'Create professional footers with links, social media, and contact information',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 19a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
        </svg>
      ),
      color: 'bg-gradient-to-br from-purple-500 to-pink-600',
      route: '/cg-builder/footer'
    }
  ];

  // Only auto-redirect if showChoiceScreen is false and type is provided
  React.useEffect(() => {
    if (!showChoiceScreen && type) {
      if (type === 'header') {
        navigate('/cg-builder/header');
      } else if (type === 'footer') {
        navigate('/cg-builder/footer');
      }
    }
  }, [type, navigate, showChoiceScreen]);


  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Layout Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select which part of your website layout you'd like to customize
          </p>
        </div>

        {/* Builder Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {builderOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(option.route)}
            >
              <div className="p-8">
                <div className={`${option.color} text-white rounded-xl p-4 inline-flex mb-6 group-hover:scale-105 transition-transform`}>
                  {option.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {option.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {option.description}
                </p>
                
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  <span>Open Builder</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Migration Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-900">New CG Builder Experience</h3>
          </div>
          <p className="text-blue-800 mb-4">
            We've improved the layout building experience! Header and Footer builders are now part of our enhanced CG Builder system.
          </p>
          <button
            onClick={() => navigate('/cg-builder')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Explore CG Builder
          </button>
        </div>
      </div>
    </div>
  );
}