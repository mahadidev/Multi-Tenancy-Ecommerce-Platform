import React, { useState, useEffect } from 'react';

interface AnalyticsSettingsTabProps {
  website: any;
  onSave: (data: any) => void;
  isSaving: boolean;
}

const AnalyticsSettingsTab: React.FC<AnalyticsSettingsTabProps> = ({ website, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    google_analytics_id: '',
    google_tag_manager_id: '',
    facebook_pixel_id: '',
    custom_head_code: '',
    custom_body_code: '',
  });

  useEffect(() => {
    if (website?.analytics_settings) {
      const analytics = website.analytics_settings;
      setFormData({
        google_analytics_id: analytics.google_analytics_id || '',
        google_tag_manager_id: analytics.google_tag_manager_id || '',
        facebook_pixel_id: analytics.facebook_pixel_id || '',
        custom_head_code: analytics.custom_head_code || '',
        custom_body_code: analytics.custom_body_code || '',
      });
    }
  }, [website]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Analytics & Tracking</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="google_analytics_id" className="block text-sm font-medium text-gray-700 mb-2">
            Google Analytics ID
          </label>
          <input
            type="text"
            id="google_analytics_id"
            value={formData.google_analytics_id}
            onChange={(e) => handleChange('google_analytics_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter your Google Analytics tracking ID
          </p>
        </div>

        <div>
          <label htmlFor="google_tag_manager_id" className="block text-sm font-medium text-gray-700 mb-2">
            Google Tag Manager ID
          </label>
          <input
            type="text"
            id="google_tag_manager_id"
            value={formData.google_tag_manager_id}
            onChange={(e) => handleChange('google_tag_manager_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="GTM-XXXXXXX"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter your Google Tag Manager container ID
          </p>
        </div>

        <div>
          <label htmlFor="facebook_pixel_id" className="block text-sm font-medium text-gray-700 mb-2">
            Facebook Pixel ID
          </label>
          <input
            type="text"
            id="facebook_pixel_id"
            value={formData.facebook_pixel_id}
            onChange={(e) => handleChange('facebook_pixel_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="XXXXXXXXXXXXXXX"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter your Facebook Pixel ID for tracking conversions
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Custom Code</h4>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="custom_head_code" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Head Code
              </label>
              <textarea
                id="custom_head_code"
                value={formData.custom_head_code}
                onChange={(e) => handleChange('custom_head_code', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="<!-- Custom code to be inserted in the <head> section -->"
              />
              <p className="text-xs text-gray-500 mt-1">
                This code will be inserted in the &lt;head&gt; section of your website
              </p>
            </div>

            <div>
              <label htmlFor="custom_body_code" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Body Code
              </label>
              <textarea
                id="custom_body_code"
                value={formData.custom_body_code}
                onChange={(e) => handleChange('custom_body_code', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="<!-- Custom code to be inserted before closing </body> tag -->"
              />
              <p className="text-xs text-gray-500 mt-1">
                This code will be inserted before the closing &lt;/body&gt; tag
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Note
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Only add trusted tracking codes and scripts. Malicious code can harm your website and visitors.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Analytics Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnalyticsSettingsTab;