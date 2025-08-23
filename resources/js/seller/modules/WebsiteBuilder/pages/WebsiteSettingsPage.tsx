import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  useGetWebsiteSettingsQuery,
  useUpdateBasicSettingsMutation,
  useUpdateSeoSettingsMutation,
  useUpdateAnalyticsSettingsMutation,
  useUpdateGlobalStylesMutation,
  useUpdateSocialMediaMutation,
  useToggleMaintenanceModeMutation,
} from '../store/websiteBuilderApi';

// Components
import BasicSettingsTab from '../components/settings/BasicSettingsTab';
import SeoSettingsTab from '../components/settings/SeoSettingsTab';
import AnalyticsSettingsTab from '../components/settings/AnalyticsSettingsTab';
import StyleSettingsTab from '../components/settings/StyleSettingsTab';
import SocialMediaSettingsTab from '../components/settings/SocialMediaSettingsTab';
import MaintenanceSettingsTab from '../components/settings/MaintenanceSettingsTab';

const WebsiteSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch website settings
  const { data: settingsData, isLoading, refetch } = useGetWebsiteSettingsQuery();

  // Mutations
  const [updateBasicSettings] = useUpdateBasicSettingsMutation();
  const [updateSeoSettings] = useUpdateSeoSettingsMutation();
  const [updateAnalyticsSettings] = useUpdateAnalyticsSettingsMutation();
  const [updateGlobalStyles] = useUpdateGlobalStylesMutation();
  const [updateSocialMedia] = useUpdateSocialMediaMutation();
  const [toggleMaintenanceMode] = useToggleMaintenanceModeMutation();

  const settings = settingsData?.data;

  const tabs = [
    { id: 'basic', name: 'Basic Settings', icon: '⚙️' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'styles', name: 'Appearance', icon: '🎨' },
    { id: 'social', name: 'Social Media', icon: '📱' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' },
  ];

  const handleSaveBasicSettings = async (data: any) => {
    try {
      setIsSaving(true);
      await updateBasicSettings(data).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update basic settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSeoSettings = async (data: any) => {
    try {
      setIsSaving(true);
      await updateSeoSettings(data).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update SEO settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAnalyticsSettings = async (data: any) => {
    try {
      setIsSaving(true);
      await updateAnalyticsSettings(data).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update analytics settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStyleSettings = async (data: any) => {
    try {
      setIsSaving(true);
      await updateGlobalStyles(data).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update style settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSocialMediaSettings = async (data: any) => {
    try {
      setIsSaving(true);
      await updateSocialMedia(data).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update social media settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleMaintenanceMode = async (data: any) => {
    try {
      setIsSaving(true);
      await toggleMaintenanceMode(data).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to toggle maintenance mode:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading website settings...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Website settings not found.</p>
        <button
          onClick={() => navigate('/websites')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Websites
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicSettingsTab
            website={settings.website}
            onSave={handleSaveBasicSettings}
            isSaving={isSaving}
          />
        );
      case 'seo':
        return (
          <SeoSettingsTab
            website={settings.website}
            onSave={handleSaveSeoSettings}
            isSaving={isSaving}
          />
        );
      case 'analytics':
        return (
          <AnalyticsSettingsTab
            website={settings.website}
            onSave={handleSaveAnalyticsSettings}
            isSaving={isSaving}
          />
        );
      case 'styles':
        return (
          <StyleSettingsTab
            website={settings.website}
            onSave={handleSaveStyleSettings}
            isSaving={isSaving}
          />
        );
      case 'social':
        return (
          <SocialMediaSettingsTab
            socialMedia={settings.social_media}
            onSave={handleSaveSocialMediaSettings}
            isSaving={isSaving}
          />
        );
      case 'maintenance':
        return (
          <MaintenanceSettingsTab
            website={settings.website}
            onSave={handleToggleMaintenanceMode}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/websites')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back to Websites
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Website Settings
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {settings.website.title}
              </div>
              <a
                href={settings.website.full_domain}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                View Website
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteSettingsPage;