import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CGBuilderLayout } from './CGBuilderLayout';
import { useGetWebsitesQuery, useGetPagesQuery, useCreatePageMutation } from '../store/websiteBuilderApi';

export function CGBuilderDashboardWithSidebar() {
  const navigate = useNavigate();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<number | null>(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  
  // Fetch websites
  const { data: websitesData, isLoading: websitesLoading } = useGetWebsitesQuery();
  const websites = websitesData?.data || [];
  
  // Fetch pages for selected website
  const { data: pagesData, isLoading: pagesLoading } = useGetPagesQuery();
  const pages = pagesData?.data || [];
  
  // Create page mutation
  const [createPage] = useCreatePageMutation();
  
  // Auto-select first website
  useEffect(() => {
    if (websites.length > 0 && !selectedWebsiteId) {
      setSelectedWebsiteId(websites[0].id);
    }
  }, [websites, selectedWebsiteId]);

  const handleCreatePage = async () => {
    if (!newPageTitle.trim() || !selectedWebsiteId) return;
    
    try {
      const result = await createPage({
        website_id: selectedWebsiteId,
        title: newPageTitle,
        slug: newPageTitle.toLowerCase().replace(/\s+/g, '-'),
        type: 'custom',
        is_published: false
      }).unwrap();
      
      setShowNewPageModal(false);
      setNewPageTitle('');
      
      // Navigate to the new page builder
      navigate(`/cg-builder/page/${result.data.id}`);
    } catch (error) {
      console.error('Failed to create page:', error);
    }
  };

  const layoutOptions = [
    {
      id: 'header',
      title: 'Header',
      description: 'Site header layout',
      icon: '🔝',
      route: '/cg-builder/header'
    },
    {
      id: 'footer', 
      title: 'Footer',
      description: 'Site footer layout',
      icon: '🔻',
      route: '/cg-builder/footer'
    },
    {
      id: 'elementor',
      title: 'Elementor',
      description: 'Advanced builder',
      icon: '⚡',
      route: '/cg-builder/elementor'
    }
  ];

  return (
    <CGBuilderLayout title="Website Builder">
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Website Selector */}
          <div className="p-4 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Website
            </label>
            <select
              value={selectedWebsiteId || ''}
              onChange={(e) => setSelectedWebsiteId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Pages Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Pages
              </h3>
              <button
                onClick={() => setShowNewPageModal(true)}
                className="text-blue-600 hover:text-blue-700 p-1"
                title="Add new page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            {pagesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : pages.length > 0 ? (
              <div className="space-y-1">
                {pages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => navigate(`/cg-builder/page/${page.id}`)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-700">{page.title}</span>
                      </div>
                      {page.is_homepage && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          Home
                        </span>
                      )}
                      {!page.is_published && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No pages yet. Create your first page!
              </p>
            )}
          </div>

          {/* Layouts Section */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Layouts & Tools
            </h3>
            <div className="space-y-1">
              {layoutOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => navigate(option.route)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{option.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm text-gray-700 font-medium">{option.title}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/website-builder/themes')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                🎨 Browse Themes
              </button>
              <button
                onClick={() => navigate('/cg-builder/menus')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                📋 Manage Menus
              </button>
              <button
                onClick={() => window.open(`https://${websites.find(w => w.id === selectedWebsiteId)?.subdomain}.mystore.com`, '_blank')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                disabled={!selectedWebsiteId}
              >
                👁️ Preview Website
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Website Builder
              </h1>
              <p className="text-lg text-gray-600">
                Select a page from the sidebar to start editing, or create a new page to begin.
              </p>
            </div>

            {/* Quick Start Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div 
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setShowNewPageModal(true)}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Page</h3>
                <p className="text-sm text-gray-600">Start with a blank canvas or choose from templates</p>
              </div>

              <div 
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/cg-builder/header')}
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Edit Header</h3>
                <p className="text-sm text-gray-600">Customize your site header and navigation</p>
              </div>

              <div 
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate('/cg-builder/footer')}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Edit Footer</h3>
                <p className="text-sm text-gray-600">Design your site footer with links and info</p>
              </div>
            </div>

            {/* Recent Activity */}
            {pages.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Pages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pages.slice(0, 6).map(page => (
                    <div
                      key={page.id}
                      onClick={() => navigate(`/cg-builder/page/${page.id}`)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{page.title}</h3>
                        {page.is_homepage && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Home
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                      <div className="mt-3 flex items-center text-xs text-gray-400">
                        <span className={`w-2 h-2 rounded-full mr-2 ${page.is_published ? 'bg-green-400' : 'bg-gray-400'}`} />
                        {page.is_published ? 'Published' : 'Draft'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Page Modal */}
      {showNewPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Page</h2>
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="Enter page title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePage()}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNewPageModal(false);
                  setNewPageTitle('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePage}
                disabled={!newPageTitle.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Page
              </button>
            </div>
          </div>
        </div>
      )}
    </CGBuilderLayout>
  );
}