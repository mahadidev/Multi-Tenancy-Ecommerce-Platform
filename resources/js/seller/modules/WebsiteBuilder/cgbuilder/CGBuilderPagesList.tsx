import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CGBuilderLayout } from './CGBuilderLayout';
import { useGetWebsitesQuery, useGetPagesQuery, useCreatePageMutation, useDeletePageMutation } from '../store/websiteBuilderApi';

export function CGBuilderPagesList() {
  const navigate = useNavigate();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<number | null>(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  
  // Fetch websites
  const { data: websitesData, isLoading: websitesLoading } = useGetWebsitesQuery();
  const websites = websitesData?.data || [];
  
  // Fetch pages for selected website
  const { data: pagesData, isLoading: pagesLoading, refetch: refetchPages } = useGetPagesQuery();
  const pages = pagesData?.data || [];
  
  // Mutations
  const [createPage] = useCreatePageMutation();
  const [deletePage] = useDeletePageMutation();
  
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
      refetchPages();
      
      // Navigate to the new page builder
      navigate(`/cg-builder/page/${result.data.id}`);
    } catch (error) {
      console.error('Failed to create page:', error);
    }
  };

  const handleDeletePage = async (pageId: number) => {
    if (!selectedWebsiteId) return;
    
    try {
      await deletePage({ websiteId: selectedWebsiteId, pageId }).unwrap();
      refetchPages();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  return (
    <CGBuilderLayout title="Pages Management">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Website Pages</h1>
              <p className="text-gray-600 mt-2">Manage and organize your website pages</p>
            </div>
            <button
              onClick={() => setShowNewPageModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Page</span>
            </button>
          </div>

          {/* Website Selector */}
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

        {/* Pages Grid */}
        {pagesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-100 rounded mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : pages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map(page => (
              <div
                key={page.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {page.title}
                      </h3>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {page.is_homepage && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          Home
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        page.is_published 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {page.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {page.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {page.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/cg-builder/page/${page.id}`)}
                        className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Edit Page
                      </button>
                      <button
                        onClick={() => navigate(`/cg-builder/elementor/${page.id}`)}
                        className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        Elementor
                      </button>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(page.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete page"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pages yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first page</p>
            <button
              onClick={() => setShowNewPageModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create First Page</span>
            </button>
          </div>
        )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delete Page</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this page? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePage(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Page
              </button>
            </div>
          </div>
        </div>
      )}
    </CGBuilderLayout>
  );
}