import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/seller/components/ui/Dialog';
import { Button } from '@/seller/components/ui/Button';
import { Input } from '@/seller/components/ui/Input';
import { Badge } from '@/seller/components/ui/Badge';
import { Alert, AlertDescription } from '@/seller/components/ui/Alert';
import { Card, CardContent } from '@/seller/components/ui/Card';
import { Theme, useThemeActions } from '../hooks/useThemes';
import { 
  Download, 
  Key, 
  AlertCircle, 
  CheckCircle, 
  Crown,
  ShieldCheck,
  X,
  ExternalLink,
  CreditCard,
  Lock
} from 'lucide-react';

interface ThemeInstallModalProps {
  theme: Theme | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (theme: Theme) => void;
}

export function ThemeInstallModal({ 
  theme, 
  isOpen, 
  onClose, 
  onSuccess 
}: ThemeInstallModalProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [step, setStep] = useState<'confirm' | 'license' | 'processing' | 'success' | 'error'>('confirm');
  const [error, setError] = useState<string>('');
  
  const { installTheme, isInstalling } = useThemeActions();

  const handleInstall = async () => {
    if (!theme) return;

    // If premium theme, validate license key
    if (!theme.is_free && !licenseKey.trim()) {
      setStep('license');
      return;
    }

    setStep('processing');
    setError('');

    try {
      await installTheme.mutateAsync({ 
        themeId: theme.id, 
        licenseKey: licenseKey.trim() || undefined 
      });
      
      setStep('success');
      if (onSuccess) {
        onSuccess(theme);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Installation failed');
      setStep('error');
    }
  };

  const resetModal = () => {
    setStep('confirm');
    setLicenseKey('');
    setError('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!theme) return null;

  const renderConfirmStep = () => (
    <div className="space-y-6">
      {/* Theme Info */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center shrink-0">
          {theme.thumbnail ? (
            <img
              src={theme.thumbnail}
              alt={theme.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Crown className="h-8 w-8 text-indigo-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {theme.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {theme.description}
          </p>
          <div className="flex items-center gap-2">
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
            {theme.is_free ? (
              <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                Free
              </Badge>
            ) : (
              <Badge className="bg-purple-500 hover:bg-purple-600 text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      {theme.features && theme.features.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">What you'll get:</h4>
            <div className="grid grid-cols-2 gap-2">
              {theme.features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <span className="text-sm text-gray-700 capitalize">
                    {feature.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
              {theme.features.length > 6 && (
                <div className="col-span-2 text-sm text-gray-500 mt-2">
                  ...and {theme.features.length - 6} more features
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Theme Notice */}
      {!theme.is_free && (
        <Alert>
          <Crown className="h-4 w-4" />
          <AlertDescription>
            This is a premium theme that costs <strong>${theme.price}</strong>. 
            You'll need a valid license key to install it.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleInstall}
          disabled={isInstalling}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          {theme.is_free ? 'Install Free Theme' : 'Continue to License'}
        </Button>
      </div>
    </div>
  );

  const renderLicenseStep = () => (
    <div className="space-y-6">
      {/* License Info */}
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          License Key Required
        </h3>
        <p className="text-gray-600">
          Please enter your license key for <strong>{theme.name}</strong>
        </p>
      </div>

      {/* License Input */}
      <div className="space-y-4">
        <div>
          <label htmlFor="license-key" className="block text-sm font-medium text-gray-700 mb-2">
            License Key
          </label>
          <Input
            id="license-key"
            type="text"
            placeholder="Enter your license key..."
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            className="text-center font-mono"
          />
        </div>

        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertDescription>
            Your license key is securely processed and stored. It will only be used 
            for theme verification and updates.
          </AlertDescription>
        </Alert>

        {/* Purchase Info */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Don't have a license key?
                </p>
                <p className="text-xs text-gray-600">
                  Purchase directly from the theme author
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('#', '_blank')} // TODO: Link to purchase page
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Purchase
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep('confirm')}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleInstall}
          disabled={!licenseKey.trim() || isInstalling}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          {isInstalling ? 'Installing...' : `Install Theme - $${theme.price}`}
        </Button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Download className="h-8 w-8 text-blue-600 animate-pulse" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Installing Theme
      </h3>
      <p className="text-gray-600 mb-4">
        Please wait while we install <strong>{theme.name}</strong>...
      </p>
      <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Theme Installed Successfully!
      </h3>
      <p className="text-gray-600 mb-6">
        <strong>{theme.name}</strong> has been installed and is ready to use.
      </p>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleClose}
          className="flex-1"
        >
          Close
        </Button>
        <Button
          onClick={handleClose}
          className="flex-1"
        >
          Go to Themes
        </Button>
      </div>
    </div>
  );

  const renderErrorStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Installation Failed
      </h3>
      <p className="text-gray-600 mb-4">
        We couldn't install <strong>{theme.name}</strong>.
      </p>
      
      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleClose}
          className="flex-1"
        >
          Close
        </Button>
        <Button
          onClick={() => {
            setError('');
            setStep(theme.is_free ? 'confirm' : 'license');
          }}
          className="flex-1"
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (step) {
      case 'license': return 'License Key Required';
      case 'processing': return 'Installing Theme';
      case 'success': return 'Installation Complete';
      case 'error': return 'Installation Failed';
      default: return 'Install Theme';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{getTitle()}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={step === 'processing'}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">
          {step === 'confirm' && renderConfirmStep()}
          {step === 'license' && renderLicenseStep()}
          {step === 'processing' && renderProcessingStep()}
          {step === 'success' && renderSuccessStep()}
          {step === 'error' && renderErrorStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}