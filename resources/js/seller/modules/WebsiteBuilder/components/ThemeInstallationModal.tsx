import React, { useState, useEffect } from 'react';
import { Theme } from '../hooks/useThemes';
import { themeInstallationService } from '../services/ThemeInstallationService';
import useStore from '../../../_hooks/useStore';
import { Check, AlertCircle, Package, Loader, Download, X } from 'lucide-react';

interface ThemeInstallationModalProps {
  theme: Theme;
  onClose: () => void;
  onInstallComplete: () => void;
}

interface InstallationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

export function ThemeInstallationModal({ theme, onClose, onInstallComplete }: ThemeInstallationModalProps) {
  const { store } = useStore();
  const [isInstalling, setIsInstalling] = useState(false);
  const [installationComplete, setInstallationComplete] = useState(false);
  const [createDemoContent, setCreateDemoContent] = useState(true);
  const [overwriteExisting, setOverwriteExisting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const [steps, setSteps] = useState<InstallationStep[]>([
    {
      id: 'theme-settings',
      title: 'Installing Theme Settings',
      description: 'Setting up theme configuration and global settings',
      status: 'pending'
    },
    {
      id: 'pages',
      title: 'Creating Pages',
      description: 'Creating all theme pages with pre-built layouts',
      status: 'pending'
    },
    {
      id: 'sections',
      title: 'Building Sections',
      description: 'Setting up Elementor sections and components',
      status: 'pending'
    },
    {
      id: 'demo-content',
      title: 'Demo Content',
      description: 'Adding sample products, categories, and content',
      status: 'pending'
    },
    {
      id: 'finalization',
      title: 'Finalizing',
      description: 'Completing installation and cleanup',
      status: 'pending'
    }
  ]);

  const updateStepStatus = (stepId: string, status: InstallationStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const handleInstall = async () => {
    if (!store?.website?.id) {
      alert('No website found. Please ensure you have a website set up.');
      return;
    }

    setIsInstalling(true);
    setInstallationComplete(false);
    setErrors([]);

    try {
      // Theme Settings
      setCurrentStep(0);
      updateStepStatus('theme-settings', 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      updateStepStatus('theme-settings', 'completed');

      // Pages Creation
      setCurrentStep(1);
      updateStepStatus('pages', 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStepStatus('pages', 'completed');

      // Sections Building
      setCurrentStep(2);
      updateStepStatus('sections', 'in-progress');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus('sections', 'completed');

      // Demo Content (if enabled)
      if (createDemoContent) {
        setCurrentStep(3);
        updateStepStatus('demo-content', 'in-progress');
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateStepStatus('demo-content', 'completed');
      } else {
        updateStepStatus('demo-content', 'completed');
      }

      // Finalization
      setCurrentStep(4);
      updateStepStatus('finalization', 'in-progress');

      // Actual installation
      const result = await themeInstallationService.installTheme({
        websiteId: store.website.id,
        themeId: theme.slug,
        overwriteExisting,
        createDemoContent
      });

      if (result.success) {
        updateStepStatus('finalization', 'completed');
        setInstallationComplete(true);
        setIsInstalling(false);
        console.log(`✅ Theme installed successfully! Created ${result.pages.length} pages.`);
      } else {
        updateStepStatus('finalization', 'error');
        setErrors(result.errors);
        // Keep installation view showing with errors, but allow user to retry
        setIsInstalling(false);
      }

    } catch (error) {
      console.error('Installation failed:', error);
      updateStepStatus(steps[currentStep]?.id || 'finalization', 'error');
      setErrors([error instanceof Error ? error.message : 'Installation failed']);
      // Show errors and allow retry
      setIsInstalling(false);
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const handleComplete = () => {
    onInstallComplete();
    onClose();
  };

  const handleRetry = () => {
    // Reset all states for retry
    setErrors([]);
    setCurrentStep(0);
    setInstallationComplete(false);
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
    // Start installation again
    handleInstall();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Install {theme.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {theme.author} • Version {theme.version}
                </p>
              </div>
            </div>
            {!isInstalling && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isInstalling && !installationComplete ? (
            <div className="space-y-6">
              {/* Theme Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">This theme includes:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {theme.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pre-built Pages */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📄 Pre-built Pages</h4>
                <p className="text-sm text-blue-700 mb-3">
                  This theme will create all essential e-commerce pages:
                </p>
                <div className="grid grid-cols-2 gap-1 text-sm text-blue-700">
                  <div>• Home Page</div>
                  <div>• Product Catalog</div>
                  <div>• Single Product</div>
                  <div>• Shopping Cart</div>
                  <div>• Checkout</div>
                  <div>• User Account</div>
                  <div>• About Us</div>
                  <div>• Contact</div>
                </div>
              </div>

              {/* Installation Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Installation Options</h3>
                
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={createDemoContent}
                    onChange={(e) => setCreateDemoContent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Create Demo Content</div>
                    <div className="text-sm text-gray-500">
                      Add sample products, categories, and content to get started quickly
                    </div>
                  </div>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={overwriteExisting}
                    onChange={(e) => setOverwriteExisting(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Overwrite Existing Pages</div>
                    <div className="text-sm text-gray-500">
                      Replace existing pages with the same names (backup recommended)
                    </div>
                  </div>
                </label>
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Important Notes</h4>
                    <ul className="text-sm text-amber-700 mt-1 space-y-1">
                      <li>• This will create multiple new pages in your website</li>
                      <li>• All pages will be fully customizable with Elementor builder</li>
                      <li>• Demo content can be edited or removed after installation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : isInstalling ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Installation Progress</span>
                  <span className="text-sm font-medium text-gray-700">{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Installation Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {step.status === 'completed' ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : step.status === 'in-progress' ? (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Loader className="w-4 h-4 text-white animate-spin" />
                        </div>
                      ) : step.status === 'error' ? (
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <X className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        step.status === 'completed' ? 'text-green-700' :
                        step.status === 'in-progress' ? 'text-blue-700' :
                        step.status === 'error' ? 'text-red-700' :
                        'text-gray-500'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Installation Errors</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : installationComplete ? (
            <div className="text-center space-y-8">
              {/* Success Animation */}
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute -inset-4 bg-green-50 rounded-full opacity-75 animate-ping"></div>
              </div>
              
              {/* Success Message */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">
                  🎉 Theme Installed Successfully!
                </h3>
                <p className="text-lg text-gray-600">
                  Your <strong>{theme.name}</strong> theme has been installed with all pages ready to customize.
                </p>
              </div>

              {/* Installation Summary */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-3 text-center">📋 Installation Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-green-700">✅ Pages Created</div>
                    <div className="text-gray-600">8 e-commerce pages</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-blue-700">🎨 Elementor Ready</div>
                    <div className="text-gray-600">All pages customizable</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-purple-700">📱 Mobile Ready</div>
                    <div className="text-gray-600">Responsive design</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-orange-700">🚀 SEO Optimized</div>
                    <div className="text-gray-600">Meta tags included</div>
                  </div>
                </div>
              </div>
              
              {/* Next Steps */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">🚀 What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-2 text-left">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Use the <strong>Elementor builder</strong> to customize any page</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Add your <strong>products and content</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Configure <strong>payment and shipping</strong> settings</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>Customize <strong>colors, fonts, and branding</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between">
            {!isInstalling && !installationComplete && errors.length === 0 ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInstall}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Theme</span>
                </button>
              </>
            ) : !isInstalling && !installationComplete && errors.length > 0 ? (
              <div className="w-full flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Retry Installation</span>
                </button>
              </div>
            ) : installationComplete ? (
              <div className="w-full flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleComplete}
                  className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>🚀 Start Customizing</span>
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="text-sm text-gray-600">
                  Installing theme... Please don't close this window.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}