import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useGetWebsiteQuery,
  useGetPagesQuery,
  useUpdateWebsiteMutation,
  useDeleteWebsiteMutation,
  usePublishWebsiteMutation,
  useUnpublishWebsiteMutation,
  useCreatePageMutation,
  useDeletePageMutation,
  useSetHomepageMutation,
} from '../store/websiteBuilderApi';
import type { WebsitePage } from '../types';

const WebsiteEditPage: React.FC = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);

  // Parse parameters safely - always use consistent values for hooks
  const websiteIdNum = websiteId && !isNaN(parseInt(websiteId, 10)) ? parseInt(websiteId, 10) : 0;

  // API queries - always call hooks in the same order
  const { data: websiteData, isLoading: websiteLoading } = useGetWebsiteQuery(
    websiteIdNum,
    { skip: websiteIdNum === 0 }
  );
  const { data: pagesData, isLoading: pagesLoading } = useGetPagesQuery(
    websiteIdNum,
    { skip: websiteIdNum === 0 }
  );

  // Mutations
  const [updateWebsite] = useUpdateWebsiteMutation();
  const [deleteWebsite] = useDeleteWebsiteMutation();
  const [publishWebsite] = usePublishWebsiteMutation();
  const [unpublishWebsite] = useUnpublishWebsiteMutation();
  const [createPage] = useCreatePageMutation();
  const [deletePage] = useDeletePageMutation();
  const [setHomepage] = useSetHomepageMutation();

  const website = websiteData?.data;
  const pages = pagesData?.data || [];

  if (websiteLoading || pagesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (websiteIdNum === 0 || (!websiteLoading && !website)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Website not found.</p>
        <button
          onClick={() => navigate('/websites')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Websites
        </button>
      </div>
    );
  }

  const handleTogglePublish = async () => {
    try {
      if (website.is_published) {
        await unpublishWebsite(website.id).unwrap();
      } else {
        await publishWebsite(website.id).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
    }
  };

  const handleDeleteWebsite = async () => {
    try {
      await deleteWebsite(website.id).unwrap();
      navigate('/websites');
    } catch (error) {
      console.error('Failed to delete website:', error);
    }
  };

  const handleCreatePage = async (title: string) => {
    try {
      const result = await createPage({
        websiteId: website.id,
        data: {
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          is_homepage: pages.length === 0, // First page becomes homepage
          is_published: false,
        },
      }).unwrap();

      setShowAddPageModal(false);
      // Navigate to page builder for the new page
      navigate(`/websites/${website.id}/pages/${result.data.id}/builder`);
    } catch (error) {
      console.error('Failed to create page:', error);
    }
  };

  const handleDeletePage = async (pageId: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      await deletePage({
        websiteId: website.id,
        pageId,
      }).unwrap();
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  const handleSetHomepage = async (pageId: number) => {
    try {
      await setHomepage({
        websiteId: website.id,
        pageId,
      }).unwrap();
    } catch (error) {
      console.error('Failed to set homepage:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <button
            onClick={() => navigate('/websites')}
            className="hover:text-gray-700"
          >
            Websites
          </button>
          <span>/</span>
          <span className="text-gray-900">{website.title}</span>
        </nav>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{website.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-gray-600">{website.subdomain}.yoursite.com</span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  website.is_published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {website.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddPageModal(true)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Add Page
            </button>
            
            <button
              onClick={handleTogglePublish}
              className={`px-4 py-2 rounded-lg font-medium ${
                website.is_published
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {website.is_published ? 'Unpublish' : 'Publish'}
            </button>
            
            {website.is_published && (
              <button
                onClick={() => window.open(website.full_domain, '_blank')}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
              >
                View Site
              </button>
            )}
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:text-red-700 px-4 py-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Pages Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage the pages of your website
          </p>
        </div>

        {pages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pages.map((page) => (
              <div key={page.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{page.title}</h3>
                      {page.is_homepage && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Homepage
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">/{page.slug}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Link
                    to={`/websites/${website.id}/pages/${page.id}/builder`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </Link>
                  
                  {!page.is_homepage && (
                    <button
                      onClick={() => handleSetHomepage(page.id)}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      Set as Homepage
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeletePage(page.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                    disabled={page.is_homepage}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-600 mb-4">No pages created yet.</p>
            <button
              onClick={() => setShowAddPageModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Your First Page
            </button>
          </div>
        )}
      </div>

      {/* Add Page Modal */}
      {showAddPageModal && (
        <AddPageModal
          onClose={() => setShowAddPageModal(false)}
          onCreate={handleCreatePage}
        />
      )}

      {/* Delete Website Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete Website</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{website.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWebsite}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Page Modal Component
const AddPageModal: React.FC<{
  onClose: () => void;
  onCreate: (title: string) => void;
}> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="About Us"
              autoFocus
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebsiteEditPage;