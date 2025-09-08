import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/seller/components/ui/Dialog';
import { Button } from '@/seller/components/ui/Button';
import { Badge } from '@/seller/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/seller/components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/seller/components/ui/Card';
import { Theme, useThemeDetails, useThemeActions, useThemePreview } from '../hooks/useThemes';
import { 
  ExternalLink, 
  Download, 
  Check, 
  Monitor, 
  Smartphone, 
  Tablet,
  Crown,
  Star,
  Users,
  Calendar,
  Package,
  Palette,
  Code,
  Layout,
  Zap,
  X,
  RefreshCw
} from 'lucide-react';

interface ThemePreviewModalProps {
  theme: Theme | null;
  isOpen: boolean;
  onClose: () => void;
  isInstalled?: boolean;
  isActive?: boolean;
}

export function ThemePreviewModal({ 
  theme, 
  isOpen, 
  onClose, 
  isInstalled = false,
  isActive = false 
}: ThemePreviewModalProps) {
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const { data: themeDetails, isLoading: isLoadingDetails } = useThemeDetails(theme?.id || null);
  const { installTheme, activateTheme, isInstalling, isActivating } = useThemeActions();
  const { generatePreview, isGenerating } = useThemePreview();

  useEffect(() => {
    if (theme && isOpen) {
      generatePreviewUrl();
    }
  }, [theme, isOpen]);

  const generatePreviewUrl = async () => {
    if (!theme) return;
    
    try {
      const previewData = await generatePreview(theme.id);
      setPreviewUrl(previewData.preview_url);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      // Fallback to theme preview URL if available
      setPreviewUrl(theme.preview_url || '');
    }
  };

  const handleInstall = async () => {
    if (!theme) return;
    
    try {
      if (!theme.is_free) {
        // TODO: Open license key modal
        console.log('Premium theme - need license key');
        return;
      }
      
      await installTheme.mutateAsync({ themeId: theme.id });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleActivate = async () => {
    if (!theme) return;
    
    try {
      await activateTheme.mutateAsync(theme.id);
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const getDeviceStyles = () => {
    switch (selectedDevice) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  if (!theme) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <DialogHeader className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-xl font-bold text-gray-900 mb-1">
                    {theme.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mb-3">
                    {theme.author && (
                      <Badge variant="outline" className="text-xs">
                        by {theme.author}
                      </Badge>
                    )}
                    {theme.version && (
                      <Badge variant="secondary" className="text-xs">
                        v{theme.version}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {theme.is_featured && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        <Crown className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {theme.is_free && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Free
                      </Badge>
                    )}
                    {isActive && (
                      <Badge className="bg-blue-500 hover:bg-blue-600">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full p-1 m-4 mb-0">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
                </TabsList>
                
                <div className="p-4">
                  <TabsContent value="overview" className="mt-0 space-y-4">
                    {/* Description */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {theme.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Users className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                        <p className="text-sm text-gray-600">Installations</p>
                        <p className="font-semibold text-gray-900">
                          {theme.installations?.toLocaleString() || 0}
                        </p>
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Package className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {theme.category}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    {!theme.is_free && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="text-2xl font-bold text-gray-900">${theme.price}</p>
                          </div>
                          <Crown className="h-8 w-8 text-indigo-500" />
                        </div>
                      </div>
                    )}

                    {/* Theme Details */}
                    {isLoadingDetails ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                      </div>
                    ) : themeDetails?.manifest && (
                      <div className="space-y-3">
                        {themeDetails.manifest.layouts && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">Layouts</h5>
                            <div className="flex flex-wrap gap-1">
                              {themeDetails.manifest.layouts.map((layout: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Layout className="h-3 w-3 mr-1" />
                                  {layout}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {themeDetails.manifest.components && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">Components</h5>
                            <div className="flex flex-wrap gap-1">
                              {themeDetails.manifest.components.slice(0, 6).map((component: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  <Code className="h-3 w-3 mr-1" />
                                  {component}
                                </Badge>
                              ))}
                              {themeDetails.manifest.components.length > 6 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{themeDetails.manifest.components.length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="features" className="mt-0 space-y-4">
                    {/* Features List */}
                    {theme.features && theme.features.length > 0 ? (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Included Features</h4>
                        <div className="space-y-2">
                          {theme.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 shrink-0" />
                              <span className="text-sm text-gray-700 capitalize">
                                {feature.replace(/_/g, ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No features listed for this theme.</p>
                    )}

                    {/* Customization Options */}
                    {themeDetails?.manifest?.config_schema && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Customization Options</h4>
                        <div className="space-y-3">
                          {Object.entries(themeDetails.manifest.config_schema).map(([section, options]: [string, any]) => (
                            <div key={section} className="border rounded-lg p-3">
                              <h5 className="font-medium text-gray-800 mb-2 capitalize flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                {section.replace(/_/g, ' ')}
                              </h5>
                              <div className="space-y-1">
                                {Object.keys(options).map((option, index) => (
                                  <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    {option.replace(/_/g, ' ')}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 space-y-3">
              {isActive ? (
                <Button className="w-full" disabled>
                  <Check className="h-4 w-4 mr-2" />
                  Currently Active
                </Button>
              ) : isInstalled ? (
                <Button
                  className="w-full"
                  onClick={handleActivate}
                  disabled={isActivating}
                >
                  {isActivating ? 'Activating...' : 'Activate Theme'}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleInstall}
                  disabled={isInstalling}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isInstalling ? 'Installing...' : theme.is_free ? 'Install Free' : `Install - $${theme.price}`}
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => previewUrl && window.open(previewUrl, '_blank')}
                disabled={!previewUrl}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex flex-col">
            {/* Preview Toolbar */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant={selectedDevice === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDevice('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedDevice === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDevice('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedDevice === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDevice('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={generatePreviewUrl}
                  disabled={isGenerating}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  Refresh Preview
                </Button>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="flex-1 p-4 bg-gray-50">
              <div className="h-full flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Generating preview...</p>
                  </div>
                ) : previewUrl ? (
                  <div 
                    className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                    style={getDeviceStyles()}
                  >
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-0"
                      title={`${theme.name} Preview`}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Preview not available
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Unable to generate a preview for this theme.
                    </p>
                    <Button onClick={generatePreviewUrl}>
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}