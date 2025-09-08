import React, { useState } from 'react';
import { useInstalledThemes, useThemeActions } from '../hooks/useThemes';
import { 
  Palette, 
  Settings, 
  Plus, 
  Crown, 
  Check,
  Eye,
  Paintbrush
} from 'lucide-react';

interface ThemeSelectorProps {
  onThemeChange?: (themeId: number) => void;
  compact?: boolean;
}

export function ThemeSelector({ onThemeChange, compact = false }: ThemeSelectorProps) {
  const [previewTheme, setPreviewTheme] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  
  const { data: installedThemes = [], isLoading } = useInstalledThemes();
  const { activateTheme, isActivating } = useThemeActions();
  
  const activeTheme = installedThemes.find(theme => theme.is_active);

  const handleActivateTheme = async (themeId: number) => {
    try {
      await activateTheme.mutateAsync(themeId);
      if (onThemeChange) {
        onThemeChange(themeId);
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCustomizeTheme = (themeId: number) => {
    window.open(`/seller/website-builder/themes/${themeId}/customize`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {activeTheme ? activeTheme.name : 'No Theme Selected'}
                </p>
                <p className="text-sm text-gray-600">
                  {installedThemes.length} theme{installedThemes.length !== 1 ? 's' : ''} installed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {activeTheme && (
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => handleCustomizeTheme(activeTheme.id)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Customize
                </button>
              )}
              
              <button
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowInstallModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Browse Themes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900">
            <Palette className="h-5 w-5" />
            Theme Management
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {installedThemes.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Themes Installed
              </h3>
              <p className="text-gray-600 mb-4">
                Install a theme to customize the look of your website.
              </p>
              <button 
                onClick={() => setShowInstallModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Browse Themes
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Active Theme */}
              {activeTheme && (
                <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        {activeTheme.thumbnail ? (
                          <img
                            src={activeTheme.thumbnail}
                            alt={activeTheme.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Crown className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{activeTheme.name}</h4>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {activeTheme.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => setPreviewTheme(activeTheme)}
                        className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleCustomizeTheme(activeTheme.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Paintbrush className="h-4 w-4 mr-1" />
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Installed Themes */}
              {installedThemes.filter(theme => !theme.is_active).map(theme => (
                <div key={theme.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {theme.thumbnail ? (
                          <img
                            src={theme.thumbnail}
                            alt={theme.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Palette className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">{theme.name}</h4>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {theme.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewTheme(theme)}
                        className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleActivateTheme(theme.id)}
                        disabled={isActivating}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isActivating ? 'Activating...' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Theme Button */}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => setShowInstallModal(true)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Browse More Themes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theme Preview Modal - TODO: Implement when needed */}
      {previewTheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {previewTheme.name} Preview
            </h3>
            <p className="text-gray-600 mb-6">
              {previewTheme.description}
            </p>
            <button
              onClick={() => setPreviewTheme(null)}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Theme Install Modal (redirect to marketplace) */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Browse Themes
            </h3>
            <p className="text-gray-600 mb-6">
              Explore our theme marketplace to find the perfect theme for your website.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowInstallModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowInstallModal(false);
                  window.open('/seller/website-builder/themes', '_blank');
                }}
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Themes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}