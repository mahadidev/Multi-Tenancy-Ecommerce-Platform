import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CGBuilderLayout } from './CGBuilderLayout';

export function CGBuilderDashboard() {
  const navigate = useNavigate();

  const builderOptions = [
    {
      id: 'page',
      title: 'Page Builder',
      description: 'Build and customize individual pages with Content, Style, and Settings tabs',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-gradient-to-br from-blue-500 to-purple-600',
      route: '/cg-builder/page'
    },
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

  return (
    <CGBuilderLayout title="CG Builder Dashboard">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to CG Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your complete website management system. Install themes, build pages, and customize everything with powerful drag-and-drop tools.
          </p>
        </div>

        {/* Builder Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
                  <span>Get Started</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Feature Highlights */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Why Choose CG Builder?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Build websites in minutes with our intuitive drag & drop interface</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Ready</h3>
              <p className="text-gray-600">All builds are responsive and optimized for mobile devices</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Tools</h3>
              <p className="text-gray-600">Advanced features and widgets for professional website creation</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/cg-builder/page')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Start Building
            </button>
            <button
              onClick={() => navigate('/cg-builder/header')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Header Builder
            </button>
            <button
              onClick={() => navigate('/cg-builder/footer')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Footer Builder
            </button>
          </div>
        </div>
      </div>
    </CGBuilderLayout>
  );
}