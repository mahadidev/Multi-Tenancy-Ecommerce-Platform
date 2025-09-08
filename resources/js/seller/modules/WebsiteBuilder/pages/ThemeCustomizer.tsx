import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useThemeDetails, 
  useActiveCustomization, 
  useCustomizationActions,
  useThemePreview
} from '../hooks/useThemes';
import { 
  Palette,
  Type,
  Layout,
  Code,
  Monitor,
  Save,
  RotateCcw,
  Eye,
  ArrowLeft
} from 'lucide-react';

export function ThemeCustomizer() {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'advanced'>('colors');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Theme and customization data
  const { data: theme, isLoading: isLoadingTheme } = useThemeDetails(themeId ? parseInt(themeId) : null);
  const { data: customization, isLoading: isLoadingCustomization } = useActiveCustomization(themeId ? parseInt(themeId) : null);
  const { updateCustomization, isUpdating } = useCustomizationActions();
  const { generatePreview, isGenerating } = useThemePreview();

  // Form state
  const [formData, setFormData] = useState({
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    spacing: {
      containerWidth: '1200px',
      sectionPadding: '4rem'
    },
    custom_css: ''
  });

  // Initialize form data when customization loads
  useEffect(() => {
    if (customization) {
      setFormData({
        colors: customization.colors || formData.colors,
        fonts: customization.fonts || formData.fonts,
        spacing: customization.spacing || formData.spacing,
        custom_css: customization.custom_css || ''
      });
    }
  }, [customization]);

  const handleSave = async () => {
    if (!customization) return;
    
    try {
      await updateCustomization.mutateAsync({
        customizationId: customization.id,
        updates: formData
      });
    } catch (error) {
      console.error('Failed to save customization:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#111827'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: {
        containerWidth: '1200px',
        sectionPadding: '4rem'
      },
      custom_css: ''
    });
  };

  const handlePreview = async () => {
    if (themeId) {
      try {
        const data = await generatePreview(parseInt(themeId), customization?.id);
        setPreviewUrl(data.preview_url);
        window.open(data.preview_url, '_blank');
      } catch (error) {
        console.error('Failed to generate preview:', error);
      }
    }
  };

  if (isLoadingTheme || isLoadingCustomization) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading theme customizer...</span>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Theme not found.</p>
        <button
          onClick={() => navigate('/seller/website-builder/themes')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Themes
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/seller/website-builder/themes')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Customize {theme.name}
              </h1>
              <p className="text-sm text-gray-600">
                Customize colors, fonts, and layout
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
            <button
              onClick={handlePreview}
              disabled={isGenerating}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Customization Panel */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'colors', label: 'Colors', icon: Palette },
                { id: 'typography', label: 'Typography', icon: Type },
                { id: 'layout', label: 'Layout', icon: Layout },
                { id: 'advanced', label: 'Advanced', icon: Code },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mx-auto mb-1" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Colors</h3>
                {Object.entries(formData.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colors: { ...prev.colors, [key]: e.target.value }
                        }))}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colors: { ...prev.colors, [key]: e.target.value }
                        }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Typography</h3>
                {Object.entries(formData.fonts).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)} Font
                    </label>
                    <select
                      value={value}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        fonts: { ...prev.fonts, [key]: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Montserrat">Montserrat</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Layout</h3>
                {Object.entries(formData.spacing).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1)}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        spacing: { ...prev.spacing, [key]: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Custom CSS</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional CSS
                  </label>
                  <textarea
                    value={formData.custom_css}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      custom_css: e.target.value
                    }))}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                    placeholder="/* Add your custom CSS here */"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 bg-gray-100 p-4">
          <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Live Preview
              </h3>
              <p className="text-gray-600 mb-4">
                Click "Preview" to see your changes in action
              </p>
              {previewUrl && (
                <button
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Open Preview
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}