import React, { useState, useEffect } from 'react';

interface BasicSettingsTabProps {
  website: any;
  onSave: (data: any) => void;
  isSaving: boolean;
}

const BasicSettingsTab: React.FC<BasicSettingsTabProps> = ({ website, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    favicon: null as File | null,
  });

  useEffect(() => {
    if (website) {
      setFormData({
        title: website.title || '',
        description: website.description || '',
        favicon: null,
      });
    }
  }, [website]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    
    if (formData.favicon) {
      submitData.append('favicon', formData.favicon);
    }
    
    onSave(submitData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, favicon: file }));
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Website Settings</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Website Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your website title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Website Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a brief description of your website"
          />
        </div>

        <div>
          <label htmlFor="favicon" className="block text-sm font-medium text-gray-700 mb-2">
            Favicon
          </label>
          <div className="flex items-center space-x-4">
            {website?.favicon && (
              <div className="flex items-center space-x-2">
                <img
                  src={`/storage/${website.favicon}`}
                  alt="Current favicon"
                  className="w-8 h-8"
                />
                <span className="text-sm text-gray-600">Current favicon</span>
              </div>
            )}
            <input
              type="file"
              id="favicon"
              accept=".ico,.png"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload a .ico or .png file (max 1MB)
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Basic Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicSettingsTab;