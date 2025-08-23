import React, { useState, useEffect } from 'react';

interface PageEditorProps {
  page?: any;
  onSave: (pageData: any) => void;
  onCancel: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ page, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    featured_image: null as File | null,
    is_published: false,
    is_homepage: false,
    template: 'default',
    custom_css: '',
    custom_js: '',
  });

  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        description: page.description || '',
        content: page.content || '',
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        meta_keywords: page.meta_keywords || '',
        featured_image: null,
        is_published: page.is_published ?? false,
        is_homepage: page.is_homepage ?? false,
        template: page.template || 'default',
        custom_css: page.custom_css || '',
        custom_js: page.custom_js || '',
      });
      setSlugEdited(true); // Don't auto-generate slug if editing existing page
    }
  }, [page]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => {
      const updates: any = { title };
      if (!slugEdited && title) {
        updates.slug = generateSlug(title);
      }
      return { ...prev, ...updates };
    });
  };

  const handleSlugChange = (slug: string) => {
    setSlugEdited(true);
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    
    // Add text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'featured_image') return; // Handle file separately
      if (typeof value === 'boolean') {
        submitData.append(key, value ? '1' : '0');
      } else {
        submitData.append(key, String(value));
      }
    });
    
    // Add file if present
    if (formData.featured_image) {
      submitData.append('featured_image', formData.featured_image);
    }
    
    onSave(submitData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, featured_image: file }));
  };

  const templates = [
    { value: 'default', label: 'Default' },
    { value: 'landing', label: 'Landing Page' },
    { value: 'blog', label: 'Blog Post' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'about', label: 'About Page' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Page Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter page title"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500 text-sm">/</span>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="page-url"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            URL-friendly version of the title
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description of the page"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Page content (HTML allowed)"
        />
        <p className="text-xs text-gray-500 mt-1">
          You can use HTML tags or plain text. For advanced layouts, use the page builder.
        </p>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
            Template
          </label>
          <select
            id="template"
            value={formData.template}
            onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {templates.map((template) => (
              <option key={template.value} value={template.value}>
                {template.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <div className="flex items-center space-x-4">
            {page?.featured_image && (
              <div className="flex items-center space-x-2">
                <img
                  src={`/storage/${page.featured_image}`}
                  alt="Featured"
                  className="w-16 h-10 object-cover rounded"
                />
                <span className="text-sm text-gray-600">Current image</span>
              </div>
            )}
            <input
              type="file"
              id="featured_image"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">Page Status</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Publish this page (make it visible to visitors)
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_homepage}
              onChange={(e) => setFormData(prev => ({ ...prev, is_homepage: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Set as homepage
            </span>
          </label>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">SEO Settings</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              id="meta_title"
              value={formData.meta_title}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO title (leave empty to use page title)"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.meta_title.length}/60 characters
            </p>
          </div>

          <div>
            <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO description"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.meta_description.length}/160 characters
            </p>
          </div>

          <div>
            <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              id="meta_keywords"
              value={formData.meta_keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="keyword1, keyword2, keyword3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate keywords with commas
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">Advanced Settings</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="custom_css" className="block text-sm font-medium text-gray-700 mb-2">
              Custom CSS
            </label>
            <textarea
              id="custom_css"
              value={formData.custom_css}
              onChange={(e) => setFormData(prev => ({ ...prev, custom_css: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="/* Custom CSS for this page */"
            />
          </div>

          <div>
            <label htmlFor="custom_js" className="block text-sm font-medium text-gray-700 mb-2">
              Custom JavaScript
            </label>
            <textarea
              id="custom_js"
              value={formData.custom_js}
              onChange={(e) => setFormData(prev => ({ ...prev, custom_js: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="// Custom JavaScript for this page"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {page ? 'Update Page' : 'Create Page'}
        </button>
      </div>
    </form>
  );
};

export default PageEditor;