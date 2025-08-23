import React, { useState, useEffect } from 'react';

interface StyleSettingsTabProps {
  website: any;
  onSave: (data: any) => void;
  isSaving: boolean;
}

const StyleSettingsTab: React.FC<StyleSettingsTabProps> = ({ website, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    primary_color: '#3B82F6',
    secondary_color: '#6B7280',
    accent_color: '#EF4444',
    background_color: '#FFFFFF',
    text_color: '#111827',
    font_family: 'Inter',
    custom_css: '',
  });

  useEffect(() => {
    if (website?.global_styles) {
      const styles = website.global_styles;
      setFormData({
        primary_color: styles.primary_color || '#3B82F6',
        secondary_color: styles.secondary_color || '#6B7280',
        accent_color: styles.accent_color || '#EF4444',
        background_color: styles.background_color || '#FFFFFF',
        text_color: styles.text_color || '#111827',
        font_family: styles.font_family || 'Inter',
        custom_css: styles.custom_css || '',
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

  const fontFamilies = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Source Sans Pro',
    'Nunito',
    'Raleway',
    'Poppins',
    'Playfair Display',
    'Merriweather',
    'Georgia',
    'Times New Roman',
    'Arial',
    'Helvetica',
  ];

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Appearance & Styles</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="primary_color"
                value={formData.primary_color}
                onChange={(e) => handleChange('primary_color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.primary_color}
                onChange={(e) => handleChange('primary_color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="secondary_color" className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="secondary_color"
                value={formData.secondary_color}
                onChange={(e) => handleChange('secondary_color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.secondary_color}
                onChange={(e) => handleChange('secondary_color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#6B7280"
              />
            </div>
          </div>

          <div>
            <label htmlFor="accent_color" className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="accent_color"
                value={formData.accent_color}
                onChange={(e) => handleChange('accent_color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.accent_color}
                onChange={(e) => handleChange('accent_color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#EF4444"
              />
            </div>
          </div>

          <div>
            <label htmlFor="background_color" className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="background_color"
                value={formData.background_color}
                onChange={(e) => handleChange('background_color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.background_color}
                onChange={(e) => handleChange('background_color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          <div>
            <label htmlFor="text_color" className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="text_color"
                value={formData.text_color}
                onChange={(e) => handleChange('text_color', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.text_color}
                onChange={(e) => handleChange('text_color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#111827"
              />
            </div>
          </div>

          <div>
            <label htmlFor="font_family" className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              id="font_family"
              value={formData.font_family}
              onChange={(e) => handleChange('font_family', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Color Preview</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-lg border border-gray-200"
                style={{ backgroundColor: formData.primary_color }}
                title="Primary Color"
              ></div>
              <div 
                className="w-12 h-12 rounded-lg border border-gray-200"
                style={{ backgroundColor: formData.secondary_color }}
                title="Secondary Color"
              ></div>
              <div 
                className="w-12 h-12 rounded-lg border border-gray-200"
                style={{ backgroundColor: formData.accent_color }}
                title="Accent Color"
              ></div>
              <div 
                className="w-12 h-12 rounded-lg border border-gray-200"
                style={{ backgroundColor: formData.background_color }}
                title="Background Color"
              ></div>
              <div 
                className="w-12 h-12 rounded-lg border border-gray-200"
                style={{ backgroundColor: formData.text_color }}
                title="Text Color"
              ></div>
            </div>
            <div className="mt-4 p-4 rounded" style={{ 
              backgroundColor: formData.background_color,
              color: formData.text_color,
              fontFamily: formData.font_family
            }}>
              <h3 style={{ color: formData.primary_color }} className="text-lg font-semibold mb-2">
                Sample Heading
              </h3>
              <p className="mb-2">
                This is how your text will look with the selected colors and font.
              </p>
              <button 
                className="px-4 py-2 rounded text-white"
                style={{ backgroundColor: formData.primary_color }}
              >
                Primary Button
              </button>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="custom_css" className="block text-sm font-medium text-gray-700 mb-2">
            Custom CSS
          </label>
          <textarea
            id="custom_css"
            value={formData.custom_css}
            onChange={(e) => handleChange('custom_css', e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="/* Add your custom CSS here */
.my-custom-class {
  color: #333;
  font-size: 16px;
}"
          />
          <p className="text-xs text-gray-500 mt-1">
            Add custom CSS to further customize your website's appearance
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Style Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StyleSettingsTab;