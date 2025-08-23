import React, { useState, useEffect } from 'react';

interface SocialMediaItem {
  id?: number;
  platform: string;
  url: string;
  is_active: boolean;
}

interface SocialMediaSettingsTabProps {
  socialMedia: SocialMediaItem[];
  onSave: (data: any) => void;
  isSaving: boolean;
}

const SocialMediaSettingsTab: React.FC<SocialMediaSettingsTabProps> = ({ socialMedia, onSave, isSaving }) => {
  const [socialMediaItems, setSocialMediaItems] = useState<SocialMediaItem[]>([]);

  const platformOptions = [
    { value: 'facebook', label: 'Facebook', icon: '📘' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'pinterest', label: 'Pinterest', icon: '📌' },
  ];

  useEffect(() => {
    if (socialMedia && Array.isArray(socialMedia)) {
      setSocialMediaItems(socialMedia.map(item => ({
        ...item,
        is_active: item.is_active ?? true
      })));
    }
  }, [socialMedia]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ social_media: socialMediaItems });
  };

  const addSocialMediaItem = () => {
    setSocialMediaItems(prev => [...prev, {
      platform: 'facebook',
      url: '',
      is_active: true,
    }]);
  };

  const removeSocialMediaItem = (index: number) => {
    setSocialMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateSocialMediaItem = (index: number, field: keyof SocialMediaItem, value: any) => {
    setSocialMediaItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const getPlatformLabel = (platform: string) => {
    const option = platformOptions.find(opt => opt.value === platform);
    return option ? `${option.icon} ${option.label}` : platform;
  };

  const getPlaceholderUrl = (platform: string) => {
    const placeholders: Record<string, string> = {
      facebook: 'https://facebook.com/yourpage',
      twitter: 'https://twitter.com/yourusername',
      instagram: 'https://instagram.com/yourusername',
      linkedin: 'https://linkedin.com/company/yourcompany',
      youtube: 'https://youtube.com/c/yourchannel',
      tiktok: 'https://tiktok.com/@yourusername',
      pinterest: 'https://pinterest.com/yourusername',
    };
    return placeholders[platform] || 'https://example.com';
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Social Media Links</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {socialMediaItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Social Media Link {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeSocialMediaItem(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`platform-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    id={`platform-${index}`}
                    value={item.platform}
                    onChange={(e) => updateSocialMediaItem(index, 'platform', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {platformOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={`url-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    id={`url-${index}`}
                    value={item.url}
                    onChange={(e) => updateSocialMediaItem(index, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={getPlaceholderUrl(item.platform)}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.is_active}
                    onChange={(e) => updateSocialMediaItem(index, 'is_active', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Show this social media link on website
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {socialMediaItems.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H5a1 1 0 01-1-1V4h2m0 0h8m0 0v16H7V4z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No social media links added yet</p>
            <button
              type="button"
              onClick={addSocialMediaItem}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Your First Social Media Link
            </button>
          </div>
        )}

        {socialMediaItems.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={addSocialMediaItem}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              + Add Another Link
            </button>
            
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Social Media Links'}
            </button>
          </div>
        )}

        {socialMediaItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Preview</h4>
            <div className="flex flex-wrap gap-2">
              {socialMediaItems.filter(item => item.is_active && item.url).map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-blue-200 text-blue-800"
                >
                  {getPlatformLabel(item.platform)}
                </span>
              ))}
            </div>
            {socialMediaItems.filter(item => item.is_active && item.url).length === 0 && (
              <p className="text-sm text-blue-700">No active social media links to display</p>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SocialMediaSettingsTab;