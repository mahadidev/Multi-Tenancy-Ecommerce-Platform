import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetWebsitesQuery,
  useCreateWebsiteMutation,
  usePublishWebsiteMutation,
  useUnpublishWebsiteMutation,
} from '../store/websiteBuilderApi';

const WebsiteManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // API queries
  const { data: websitesData, isLoading, refetch } = useGetWebsitesQuery();

  // Mutations
  const [createWebsite] = useCreateWebsiteMutation();
  const [publishWebsite] = usePublishWebsiteMutation();
  const [unpublishWebsite] = useUnpublishWebsiteMutation();

  const websites = websitesData?.data || [];
  const mainWebsite = websites[0]; // Since one store = one website

  const handlePublishToggle = async (websiteId: number, isPublished: boolean) => {
    try {
      if (isPublished) {
        await unpublishWebsite(websiteId).unwrap();
      } else {
        await publishWebsite(websiteId).unwrap();
      }
      refetch();
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading website...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Website Management
              </h1>
            </div>
            {mainWebsite && (
              <div className="flex items-center space-x-4">
                <a
                  href={mainWebsite.full_domain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View Website ↗
                </a>
                <button
                  onClick={() => handlePublishToggle(mainWebsite.id, mainWebsite.is_published)}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    mainWebsite.is_published
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {mainWebsite.is_published ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mainWebsite ? (
          <div className="space-y-6">
            {/* Website Overview */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{mainWebsite.title}</h2>
                    <p className="text-sm text-gray-500">{mainWebsite.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      mainWebsite.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {mainWebsite.is_published ? 'Published' : 'Draft'}
                    </span>
                    {mainWebsite.is_maintenance_mode && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Maintenance
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {mainWebsite.pages?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Total Pages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {mainWebsite.pages?.filter((p: any) => p.is_published)?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Published Pages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {mainWebsite.menus?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Navigation Menus</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                onClick={() => navigate(`/websites/${mainWebsite.id}/pages`)}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-lg p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Pages</h3>
                    <p className="text-sm text-gray-500">Manage website pages</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigate(`/websites/${mainWebsite.id}/menus`)}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="bg-green-500 rounded-lg p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Menus</h3>
                    <p className="text-sm text-gray-500">Build navigation menus</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigate(`/websites/${mainWebsite.id}/settings`)}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="bg-purple-500 rounded-lg p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Settings</h3>
                    <p className="text-sm text-gray-500">Configure website settings</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigate(`/websites/${mainWebsite.id}/builder`)}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="bg-orange-500 rounded-lg p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1a2 2 0 114 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Page Builder</h3>
                    <p className="text-sm text-gray-500">Visual page builder</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Pages */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recent Pages</h3>
                <button
                  onClick={() => navigate(`/websites/${mainWebsite.id}/pages`)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View all →
                </button>
              </div>
              
              <div className="p-6">
                {mainWebsite.pages && mainWebsite.pages.length > 0 ? (
                  <div className="space-y-3">
                    {mainWebsite.pages.slice(0, 5).map((page: any) => (
                      <div key={page.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            page.is_published ? 'bg-green-400' : 'bg-gray-400'
                          }`}></div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{page.title}</h4>
                            <p className="text-xs text-gray-500">
                              {page.is_homepage && 'Homepage • '}
                              Last updated: {new Date(page.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/websites/${mainWebsite.id}/pages/${page.id}/builder`)}
                            className="text-blue-600 hover:text-blue-700 text-xs"
                          >
                            Edit
                          </button>
                          {page.is_published && (
                            <a
                              href={`${mainWebsite.full_domain}${page.slug === 'home' ? '' : '/' + page.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 text-xs"
                            >
                              View
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No pages created yet</p>
                    <button
                      onClick={() => navigate(`/websites/${mainWebsite.id}/pages`)}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Create your first page
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tips & Getting Started */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow">
              <div className="p-6 text-white">
                <h3 className="text-lg font-medium mb-4">🚀 Getting Started with Your Website</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <h4 className="font-medium mb-2">1. Customize Your Homepage</h4>
                    <p className="text-sm text-blue-100">
                      Use the page builder to create an engaging homepage that represents your brand.
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <h4 className="font-medium mb-2">2. Set Up Navigation</h4>
                    <p className="text-sm text-blue-100">
                      Create menus to help visitors navigate your website easily.
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <h4 className="font-medium mb-2">3. Configure Settings</h4>
                    <p className="text-sm text-blue-100">
                      Add your social media links, SEO settings, and analytics tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Website Found
              </h3>
              <p className="text-gray-500 mb-4">
                Your website should be automatically created when you set up your store. 
                If you don't see your website, please contact support.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteManagementPage;