import React, { useState, useEffect } from 'react';

interface SeoSettingsTabProps {
  website: any;
  onSave: (data: any) => void;
  isSaving: boolean;
}

const SeoSettingsTab: React.FC<SeoSettingsTabProps> = ({ website, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_title: '',
    og_description: '',
    og_image: null as File | null,
  });

  useEffect(() => {
    if (website?.seo_meta) {
      const seoMeta = website.seo_meta;
      setFormData({
        seo_title: seoMeta.title || '',
        seo_description: seoMeta.description || '',
        seo_keywords: seoMeta.keywords || '',
        og_title: seoMeta.og_title || '',
        og_description: seoMeta.og_description || '',
        og_image: null,
      });
    }
  }, [website]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('seo_title', formData.seo_title);
    submitData.append('seo_description', formData.seo_description);
    submitData.append('seo_keywords', formData.seo_keywords);
    submitData.append('og_title', formData.og_title);
    submitData.append('og_description', formData.og_description);
    
    if (formData.og_image) {
      submitData.append('og_image', formData.og_image);
    }
    
    onSave(submitData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, og_image: file }));
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium text-gray-900 mb-6">SEO Settings</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700 mb-2">
            SEO Title
          </label>
          <input
            type="text"
            id="seo_title"
            value={formData.seo_title}
            onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter SEO title (max 60 characters)"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.seo_title.length}/60 characters
          </p>
        </div>

        <div>
          <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 mb-2">
            SEO Description
          </label>
          <textarea
            id="seo_description"
            value={formData.seo_description}
            onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter SEO description (max 160 characters)"
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.seo_description.length}/160 characters
          </p>
        </div>

        <div>
          <label htmlFor="seo_keywords" className="block text-sm font-medium text-gray-700 mb-2">
            SEO Keywords
          </label>
          <input
            type="text"
            id="seo_keywords"
            value={formData.seo_keywords}
            onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter keywords separated by commas"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate keywords with commas
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Open Graph (Social Media)</h4>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="og_title" className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Title
              </label>
              <input
                type="text"
                id="og_title"
                value={formData.og_title}
                onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Title for social media sharing"
              />
            </div>

            <div>
              <label htmlFor="og_description" className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Description
              </label>
              <textarea
                id="og_description"
                value={formData.og_description}
                onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description for social media sharing"
              />
            </div>

            <div>
              <label htmlFor="og_image" className="block text-sm font-medium text-gray-700 mb-2">
                Open Graph Image
              </label>
              <div className="flex items-center space-x-4">
                {website?.seo_meta?.og_image && (
                  <div className="flex items-center space-x-2">
                    <img
                      src={`/storage/${website.seo_meta.og_image}`}
                      alt="Current OG image"
                      className="w-16 h-10 object-cover rounded"
                    />
                    <span className="text-sm text-gray-600">Current image</span>
                  </div>
                )}
                <input
                  type="file"
                  id="og_image"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: 1200x630px (max 2MB)
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save SEO Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeoSettingsTab;