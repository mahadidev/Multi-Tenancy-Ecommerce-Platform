import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CGBuilderLayout } from './CGBuilderLayout';
import { useGetWebsitesQuery } from '../store/websiteBuilderApi';

export function CGBuilderLayoutsList() {
  const navigate = useNavigate();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<number | null>(null);
  
  // Fetch websites
  const { data: websitesData, isLoading: websitesLoading } = useGetWebsitesQuery();
  const websites = websitesData?.data || [];
  
  // Auto-select first website
  useEffect(() => {
    if (websites.length > 0 && !selectedWebsiteId) {
      setSelectedWebsiteId(websites[0].id);
    }
  }, [websites, selectedWebsiteId]);

  const layoutTypes = [
    {
      id: 'header',
      title: 'Header',
      description: 'Design your website header with logo, navigation menu, and call-to-action buttons',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-600',
      route: '/cg-builder/header',
      status: 'active'
    },
    {
      id: 'footer',
      title: 'Footer',
      description: 'Create a professional footer with links, social media, and contact information',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
      route: '/cg-builder/footer',
      status: 'active'
    },
    {
      id: 'sidebar',
      title: 'Sidebar',
      description: 'Build sidebars for additional navigation and widget areas',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4m0-16v16m0-16h10a2 2 0 012 2v12a2 2 0 01-2 2H9" />
        </svg>
      ),
      color: 'from-green-500 to-teal-600',
      route: '/cg-builder/sidebar',
      status: 'coming-soon'
    },
    {
      id: 'popup',
      title: 'Popup/Modal',
      description: 'Design popups for promotions, announcements, and user interactions',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      color: 'from-orange-500 to-red-600',
      route: '/cg-builder/popup',
      status: 'coming-soon'
    },
    {
      id: 'mega-menu',
      title: 'Mega Menu',
      description: 'Create advanced dropdown menus with columns and rich content',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      color: 'from-indigo-500 to-purple-600',
      route: '/cg-builder/mega-menu',
      status: 'coming-soon'
    },
    {
      id: 'archive',
      title: 'Archive Template',
      description: 'Design templates for blog archives, product listings, and category pages',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      color: 'from-gray-600 to-gray-800',
      route: '/cg-builder/archive',
      status: 'coming-soon'
    }
  ];

  return (
    <CGBuilderLayout title="Layout Builder">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Website Selector */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Website
            </label>
            <select
              value={selectedWebsiteId || ''}
              onChange={(e) => setSelectedWebsiteId(Number(e.target.value))}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={websitesLoading}
            >
              {websitesLoading ? (
                <option>Loading...</option>
              ) : (
                websites.map(website => (
                  <option key={website.id} value={website.id}>
                    {website.title || website.subdomain}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Layout Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {layoutTypes.map((layout) => (
            <div
              key={layout.id}
              className={`relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
                layout.status === 'active' 
                  ? 'hover:shadow-lg hover:border-gray-300 cursor-pointer transition-all' 
                  : 'opacity-75'
              }`}
              onClick={() => layout.status === 'active' && navigate(layout.route)}
            >
              {layout.status === 'coming-soon' && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                  <span className="px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
                    Coming Soon
                  </span>
                </div>
              )}
              
              <div className="p-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${layout.color} text-white flex items-center justify-center mb-4`}>
                  {layout.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {layout.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {layout.description}
                </p>
                
                {layout.status === 'active' && (
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Customize {layout.title}</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Tools Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Builder Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
              onClick={() => navigate('/cg-builder/elementor')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                  E
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Elementor Builder</h3>
                  <p className="text-sm text-gray-600">Advanced drag-and-drop builder</p>
                </div>
              </div>
              <button className="text-purple-600 font-medium text-sm hover:text-purple-700">
                Open Elementor →
              </button>
            </div>

            <div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
              onClick={() => navigate('/cg-builder/page')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Page Builder</h3>
                  <p className="text-sm text-gray-600">Build custom pages from scratch</p>
                </div>
              </div>
              <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
                Open Page Builder →
              </button>
            </div>

            <div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer"
              onClick={() => navigate('/cg-builder/menus')}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Menu Manager</h3>
                  <p className="text-sm text-gray-600">Create and manage navigation menus</p>
                </div>
              </div>
              <button className="text-green-600 font-medium text-sm hover:text-green-700">
                Manage Menus →
              </button>
            </div>
          </div>
        </div>
      </div>
    </CGBuilderLayout>
  );
}