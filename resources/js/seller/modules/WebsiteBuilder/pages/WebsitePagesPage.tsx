import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetPagesQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useDuplicatePageMutation,
  useSetHomepageMutation,
} from '../store/websiteBuilderApi';
import PageEditor from '../components/pages/PageEditor';

const WebsitePagesPage: React.FC = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [dropdownOpenPageId, setDropdownOpenPageId] = useState<number | null>(null);

  const websiteIdNum = websiteId ? parseInt(websiteId, 10) : 0;

  // API queries
  const { data: pagesData, isLoading, refetch } = useGetPagesQuery();

  // Mutations
  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation();
  const [deletePage] = useDeletePageMutation();
  const [duplicatePage] = useDuplicatePageMutation();
  const [setHomepage] = useSetHomepageMutation();

  const pages = pagesData?.data || [];

  const handleCreatePage = async (pageData: any) => {
    try {
      await createPage({
        websiteId: websiteIdNum,
        data: pageData,
      }).unwrap();
      refetch();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create page:', error);
    }
  };

  const handleUpdatePage = async (pageData: any) => {
    if (!selectedPage) return;
    
    try {
      await updatePage({
        websiteId: websiteIdNum,
        pageId: selectedPage.id,
        data: pageData,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update page:', error);
    }
  };

  const handleDeletePage = async (pageId: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    try {
      await deletePage({
        websiteId: websiteIdNum,
        pageId,
      }).unwrap();
      refetch();
      if (selectedPage?.id === pageId) {
        setSelectedPage(null);
      }
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  const handleDuplicatePage = async (pageId: number) => {
    try {
      await duplicatePage({
        websiteId: websiteIdNum,
        pageId,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to duplicate page:', error);
    }
  };

  const handleSetHomepage = async (pageId: number) => {
    if (!confirm('Set this page as the homepage?')) return;
    
    try {
      await setHomepage({
        websiteId: websiteIdNum,
        pageId,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to set homepage:', error);
    }
  };

  const handleEditPage = (page: any) => {
    navigate(`/websites/${websiteId}/pages/${page.id}/builder`);
  };

  const handleEditWithCGBuilder = (page: any) => {
    navigate(`/cg-builder/page/${websiteId}/${page.id}`);
  };

  const handleEditWithElementor = (page: any) => {
    navigate(`/cg-builder/elementor/${websiteId}/${page.id}`);
  };

  const toggleDropdown = (pageId: number) => {
    setDropdownOpenPageId(dropdownOpenPageId === pageId ? null : pageId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpenPageId(null);
    };

    if (dropdownOpenPageId !== null) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpenPageId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading pages...</span>
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
              <button
                onClick={() => navigate('/websites')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back to Websites
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Website Pages
              </h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create New Page
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showCreateForm ? (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Create New Page</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <PageEditor
                onSave={handleCreatePage}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        ) : null}

        {selectedPage ? (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Edit Page: {selectedPage.title}
              </h2>
              <button
                onClick={() => setSelectedPage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <PageEditor
                page={selectedPage}
                onSave={handleUpdatePage}
                onCancel={() => setSelectedPage(null)}
              />
            </div>
          </div>
        ) : null}

        {/* Pages Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pages</h2>
          </div>
          
          {pages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pages created yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first page to start building your website.
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create Your First Page
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {pages.map((page: any) => (
                <div key={page.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    {page.featured_image ? (
                      <img
                        src={`/storage/${page.featured_image}`}
                        alt={page.title}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {page.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {page.is_homepage && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Homepage
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          page.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {page.description || 'No description'}
                    </p>
                    
                    <div className="text-xs text-gray-400 mb-3">
                      Created: {new Date(page.created_at).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(page.id);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 flex items-center space-x-1"
                        >
                          <span>Edit Content</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {dropdownOpenPageId === page.id && (
                          <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleEditPage(page);
                                  setDropdownOpenPageId(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1a2 2 0 114 0z" />
                                </svg>
                                Standard Builder
                              </button>
                              <button
                                onClick={() => {
                                  handleEditWithCGBuilder(page);
                                  setDropdownOpenPageId(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <div className="w-4 h-4 mr-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">CG</span>
                                </div>
                                CG Builder
                              </button>
                              <button
                                onClick={() => {
                                  handleEditWithElementor(page);
                                  setDropdownOpenPageId(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <div className="w-4 h-4 mr-2 bg-purple-600 rounded flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">E</span>
                                </div>
                                Elementor Builder
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedPage(page)}
                          className="text-gray-600 hover:text-gray-700"
                          title="Edit Settings"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        
                        <div className="relative">
                          <button className="text-gray-600 hover:text-gray-700 p-1" title="More actions">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                          {/* Dropdown menu would go here */}
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        {!page.is_homepage && (
                          <button
                            onClick={() => handleSetHomepage(page.id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Set as Homepage
                          </button>
                        )}
                        <button
                          onClick={() => handleDuplicatePage(page.id)}
                          className="text-xs text-green-600 hover:text-green-700"
                        >
                          Duplicate
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsitePagesPage;