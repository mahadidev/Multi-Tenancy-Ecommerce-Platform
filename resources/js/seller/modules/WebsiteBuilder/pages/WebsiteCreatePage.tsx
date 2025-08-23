import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCreateWebsiteMutation,
  useGetTemplatesQuery,
  useCreateWebsiteFromTemplateMutation,
} from '../store/websiteBuilderApi';
import type { WebsiteTemplate } from '../types';

const WebsiteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [createFromTemplate, setCreateFromTemplate] = useState(false);
  const [title, setTitle] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate | null>(null);

  // API queries and mutations
  const { data: templatesData } = useGetTemplatesQuery({});
  const [createWebsite, { isLoading: isCreating }] = useCreateWebsiteMutation();
  const [createWebsiteFromTemplate, { isLoading: isCreatingFromTemplate }] = 
    useCreateWebsiteFromTemplateMutation();

  const templates = templatesData?.data || [];

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !subdomain) return;

    try {
      const result = await createWebsite({
        title,
        subdomain,
        description: '',
        is_published: false,
      }).unwrap();

      navigate(`/websites/${result.data.id}`);
    } catch (error) {
      console.error('Failed to create website:', error);
    }
  };

  const handleCreateFromTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate || !title || !subdomain) return;

    try {
      const result = await createWebsiteFromTemplate({
        template_id: selectedTemplate.id,
        title,
        subdomain,
      }).unwrap();

      navigate(`/websites/${result.data.id}`);
    } catch (error) {
      console.error('Failed to create website from template:', error);
    }
  };

  const isLoading = isCreating || isCreatingFromTemplate;

  return (
    <div className="max-w-4xl mx-auto p-6">
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
          <span className="text-gray-900">Create Website</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900">Create a New Website</h1>
        <p className="text-gray-600 mt-2">
          Start from scratch or choose a template to get started quickly
        </p>
      </div>

      {/* Creation Method Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-8 max-w-md">
        <button
          onClick={() => setCreateFromTemplate(false)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            !createFromTemplate
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Start from Scratch
        </button>
        <button
          onClick={() => setCreateFromTemplate(true)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            createFromTemplate
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Use Template
        </button>
      </div>

      {createFromTemplate ? (
        /* Template Selection */
        <div>
          <h2 className="text-xl font-semibold mb-6">Choose a Template</h2>
          
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {template.preview_image && (
                    <img
                      src={template.preview_image}
                      alt={template.name}
                      className="w-full h-40 object-cover rounded mb-3"
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No templates available at the moment.</p>
            </div>
          )}

          {/* Website Details Form for Template */}
          {selectedTemplate && (
            <form onSubmit={handleCreateFromTemplate} className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Website Details</h3>
              <p className="text-sm text-gray-600 mb-6">
                Selected template: <strong>{selectedTemplate.name}</strong>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                
                <div>
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
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/websites')}
                  className="px-6 py-2 text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Website'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Blank Website Form */
        <form onSubmit={handleCreateWebsite} className="bg-white border rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6">Website Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
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
              <p className="text-xs text-gray-500 mt-1">
                This will be the main title of your website
              </p>
            </div>
            
            <div>
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
          </div>
          
          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={() => navigate('/websites')}
              className="px-6 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Website'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WebsiteCreatePage;