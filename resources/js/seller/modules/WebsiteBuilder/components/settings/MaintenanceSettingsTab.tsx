import React, { useState, useEffect } from 'react';

interface MaintenanceSettingsTabProps {
  website: any;
  onSave: (data: any) => void;
  isSaving: boolean;
}

const MaintenanceSettingsTab: React.FC<MaintenanceSettingsTabProps> = ({ website, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    is_maintenance_mode: false,
    maintenance_message: '',
  });

  useEffect(() => {
    if (website) {
      setFormData({
        is_maintenance_mode: website.is_maintenance_mode || false,
        maintenance_message: website.maintenance_message || '',
      });
    }
  }, [website]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const defaultMaintenanceMessage = `We're currently performing some scheduled maintenance.
We'll be back shortly. Thank you for your patience!`;

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Maintenance Mode</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                About Maintenance Mode
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  When maintenance mode is enabled, your website will show a maintenance page to visitors. 
                  You can still access the admin dashboard to make changes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Enable Maintenance Mode</h4>
              <p className="text-sm text-gray-500 mt-1">
                Turn on maintenance mode to temporarily disable public access to your website
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_maintenance_mode}
                onChange={(e) => handleChange('is_maintenance_mode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {formData.is_maintenance_mode && (
            <div 
              className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center space-x-2 text-red-700">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Website is in maintenance mode</span>
              </div>
              
              <div>
                <label htmlFor="maintenance_message" className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Message
                </label>
                <textarea
                  id="maintenance_message"
                  value={formData.maintenance_message}
                  onChange={(e) => handleChange('maintenance_message', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={defaultMaintenanceMessage}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This message will be displayed to visitors when your site is in maintenance mode
                </p>
              </div>

              {!formData.maintenance_message && (
                <button
                  type="button"
                  onClick={() => handleChange('maintenance_message', defaultMaintenanceMessage)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Use default message
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Preview</h4>
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 11.172V5l-1-1z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-4">
                {website?.title || 'Your Website'} - Under Maintenance
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {formData.maintenance_message || defaultMaintenanceMessage}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 rounded-md font-medium ${
              formData.is_maintenance_mode 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSaving ? 'Saving...' : formData.is_maintenance_mode ? 'Update Maintenance Settings' : 'Save Settings'}
          </button>
          
          {formData.is_maintenance_mode && (
            <p className="text-sm text-red-600 mt-2">
              ⚠️ Your website is currently in maintenance mode and not accessible to visitors
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default MaintenanceSettingsTab;