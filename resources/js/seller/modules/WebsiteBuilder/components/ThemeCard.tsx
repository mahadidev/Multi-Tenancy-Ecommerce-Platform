import React, { useState } from 'react';
import { Theme, useThemeActions, useThemePreview } from '../hooks/useThemes';
import { 
  Eye, 
  Download, 
  Check, 
  Star, 
  Users, 
  ExternalLink,
  Crown,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface ThemeCardProps {
  theme: Theme;
  isInstalled?: boolean;
  isActive?: boolean;
  onPreview?: (theme: Theme) => void;
  onInstall?: (theme: Theme) => void;
  onActivate?: (theme: Theme) => void;
  className?: string;
}

export function ThemeCard({
  theme,
  isInstalled = false,
  isActive = false,
  onPreview,
  onInstall,
  onActivate,
  className = ''
}: ThemeCardProps) {
  const { installTheme, activateTheme, reinstallTheme, isInstalling, isActivating, isReinstalling } = useThemeActions();
  const { generatePreview, isGenerating } = useThemePreview();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePreview = async () => {
    if (onPreview) {
      onPreview(theme);
    } else {
      try {
        const previewData = await generatePreview(theme.id);
        window.open(previewData.preview_url, '_blank');
      } catch (error) {
        console.error('Preview failed:', error);
      }
    }
  };

  const handleInstall = async () => {
    if (onInstall) {
      onInstall(theme);
    } else if (!theme.is_free) {
      // TODO: Open license key modal
      console.log('Premium theme - need license key');
    } else {
      try {
        await installTheme.mutateAsync({ themeId: theme.id });
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleActivate = async () => {
    if (onActivate) {
      onActivate(theme);
    } else {
      try {
        await activateTheme.mutateAsync(theme.id);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleReinstall = async () => {
    try {
      await reinstallTheme.mutateAsync({
        websiteId: 1, // TODO: Get current website ID from context
        themeSlug: theme.slug,
        options: {
          reset_content: true,
          reset_header_footer: true,
          create_demo_content: true
        }
      });
    } catch (error) {
      console.error('Reinstall failed:', error);
    }
  };

  const renderThemeImage = () => {
    if (imageError || !theme.thumbnail) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Sparkles className="h-12 w-12 mx-auto mb-2 text-indigo-400" />
            <p className="text-sm font-medium">{theme.name}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-48 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={theme.thumbnail}
          alt={`${theme.name} theme preview`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            onClick={handlePreview}
            disabled={isGenerating}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isGenerating ? 'Loading...' : 'Preview'}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {theme.is_featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Featured
            </span>
          )}
          {theme.is_free && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 hover:bg-green-600 text-white">
              Free
            </span>
          )}
          {isActive && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white">
              <Check className="h-3 w-3 mr-1" />
              Active
            </span>
          )}
        </div>

        {/* Price */}
        {!theme.is_free && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm border border-gray-300 text-gray-700">
              ${theme.price}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderActionButtons = () => {
    if (isActive) {
      return (
        <div className="flex gap-2">
          <button
            onClick={handlePreview}
            disabled={isGenerating}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 disabled:opacity-50"
            disabled
          >
            <Check className="h-4 w-4 mr-2" />
            Active
          </button>
        </div>
      );
    }

    if (isInstalled) {
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              disabled={isGenerating}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button
              onClick={handleActivate}
              disabled={isActivating}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isActivating ? 'Activating...' : 'Activate'}
            </button>
          </div>
          <button
            onClick={handleReinstall}
            disabled={isReinstalling}
            className="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isReinstalling ? 'Reinstalling...' : 'Reinstall with Demo Content'}
          </button>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <button
          onClick={handlePreview}
          disabled={isGenerating}
          className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </button>
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <Download className="h-4 w-4 mr-2" />
          {isInstalling ? 'Installing...' : 'Install'}
        </button>
      </div>
    );
  };

  return (
    <div className={`group hover:shadow-lg transition-all duration-300 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="p-0">
        {renderThemeImage()}
      </div>
      
      <div className="p-4 space-y-3">
        {/* Theme Info */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {theme.name}
            </h3>
            {theme.author && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                {theme.author}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {theme.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{theme.installations?.toLocaleString() || 0}</span>
            </div>
            
            {theme.category && (
              <div className="flex items-center gap-1">
                <span className="capitalize">{theme.category}</span>
              </div>
            )}

            {theme.version && (
              <div className="flex items-center gap-1">
                <span>v{theme.version}</span>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        {theme.features && theme.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {theme.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {feature.replace(/_/g, ' ')}
              </span>
            ))}
            {theme.features.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                +{theme.features.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-4 pt-0">
        {renderActionButtons()}
      </div>
    </div>
  );
}

// Loading skeleton component
export function ThemeCardSkeleton() {
  return (
    <div className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-0">
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
        
        <div className="flex gap-1">
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-14 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
          <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
        </div>
      </div>
    </div>
  );
}