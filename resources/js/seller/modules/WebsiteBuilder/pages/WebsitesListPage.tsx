import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetWebsitesQuery,
  useCreateWebsiteMutation,
  useDeleteWebsiteMutation,
  usePublishWebsiteMutation,
  useUnpublishWebsiteMutation,
  useGetTemplatesQuery,
  useCreateWebsiteFromTemplateMutation,
} from '../store/websiteBuilderApi';
import type { StoreWebsite, WebsiteTemplate } from '../types';

const WebsitesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // API queries
  const { data: websitesData, isLoading: websitesLoading } = useGetWebsitesQuery();
  const { data: templatesData } = useGetTemplatesQuery({});
  
  // Mutations
  const [createWebsite] = useCreateWebsiteMutation();
  const [deleteWebsite] = useDeleteWebsiteMutation();
  const [publishWebsite] = usePublishWebsiteMutation();
  const [unpublishWebsite] = useUnpublishWebsiteMutation();
  const [createFromTemplate] = useCreateWebsiteFromTemplateMutation();

  const websites = websitesData?.data || [];
  const templates = templatesData?.data || [];

  const handleCreateWebsite = async (data: { title: string; subdomain: string }) => {
    try {
      const result = await createWebsite(data).unwrap();
      setShowCreateModal(false);
      navigate(`/websites/${result.id}`);
    } catch (error) {
      console.error('Failed to create website:', error);
    }
  };

  const handleCreateFromTemplate = async (data: {
    template_id: number;
    title: string;
    subdomain: string;
  }) => {
    try {
      const result = await createFromTemplate(data).unwrap();
      setShowTemplateModal(false);
      navigate(`/websites/${result.id}`);
    } catch (error) {
      console.error('Failed to create website from template:', error);
    }
  };

  const handleDeleteWebsite = async (websiteId: number) => {
    if (!confirm('Are you sure you want to delete this website?')) {
      return;
    }

    try {
      await deleteWebsite(websiteId).unwrap();
    } catch (error) {
      console.error('Failed to delete website:', error);
    }
  };

  const handleTogglePublish = async (website: StoreWebsite) => {
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

  if (websitesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading websites...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Websites</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your e-commerce websites
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Start from Template
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Website
          </button>
        </div>
      </div>

      {/* Websites Grid */}
      {websites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <div
              key={website.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{website.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{website.subdomain}</p>
                </div>
                
                <div className="flex items-center space-x-2">
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

              {website.description && (
                <p className="text-gray-600 text-sm mb-4">{website.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/websites/${website.id}`)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => window.open(website.full_domain, '_blank')}
                    className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    disabled={!website.is_published}
                  >
                    View
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTogglePublish(website)}
                    className={`text-sm font-medium ${
                      website.is_published
                        ? 'text-orange-600 hover:text-orange-700'
                        : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    {website.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDeleteWebsite(website.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-2xl">🌐</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No websites yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first website to start building your online presence
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200"
            >
              Start from Template
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Website
            </button>
          </div>
        </div>
      )}

      {/* Create Website Modal */}
      {showCreateModal && (
        <CreateWebsiteModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateWebsite}
        />
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <TemplateSelectionModal
          templates={templates}
          onClose={() => setShowTemplateModal(false)}
          onCreate={handleCreateFromTemplate}
        />
      )}
    </div>
  );
};

// Create Website Modal Component
const CreateWebsiteModal: React.FC<{
  onClose: () => void;
  onCreate: (data: { title: string; subdomain: string }) => void;
}> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [subdomain, setSubdomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && subdomain) {
      onCreate({ title, subdomain });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Website</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="My Awesome Store"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subdomain
            </label>
            <input
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="my-store"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Your website will be available at: {subdomain || 'my-store'}.yoursite.com
            </p>
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
              Create Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Template Selection Modal Component
const TemplateSelectionModal: React.FC<{
  templates: WebsiteTemplate[];
  onClose: () => void;
  onCreate: (data: { template_id: number; title: string; subdomain: string }) => void;
}> = ({ templates, onClose, onCreate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate | null>(null);
  const [title, setTitle] = useState('');
  const [subdomain, setSubdomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTemplate && title && subdomain) {
      onCreate({
        template_id: selectedTemplate.id,
        title,
        subdomain,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
        
        {!selectedTemplate ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 transition-colors"
                >
                  {template.preview_image && (
                    <img
                      src={template.preview_image}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  {template.is_premium && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-2">
                      Premium - ${template.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Selected template: <strong>{selectedTemplate.name}</strong>
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="My Awesome Store"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subdomain
              </label>
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="my-store"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Back
              </button>
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
                Create Website
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WebsitesListPage;