import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import pages
import WebsiteManagementPage from '../pages/WebsiteManagementPage';
import WebsiteSettingsPage from '../pages/WebsiteSettingsPage';
import WebsiteMenusPage from '../pages/WebsiteMenusPage';
import WebsitePagesPage from '../pages/WebsitePagesPage';
import WebsiteBuilderPage from '../pages/WebsiteBuilderPage';

const WebsiteBuilderRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main website management dashboard */}
      <Route path="/websites" element={<WebsiteManagementPage />} />
      
      {/* Website settings */}
      <Route path="/websites/:websiteId/settings" element={<WebsiteSettingsPage />} />
      
      {/* Website menus */}
      <Route path="/websites/:websiteId/menus" element={<WebsiteMenusPage />} />
      
      {/* Website pages */}
      <Route path="/websites/:websiteId/pages" element={<WebsitePagesPage />} />
      
      {/* Page builder */}
      <Route path="/websites/:websiteId/pages/:pageId/builder" element={<WebsiteBuilderPage />} />
      <Route path="/websites/:websiteId/builder" element={<WebsiteBuilderPage />} />
    </Routes>
  );
};

export default WebsiteBuilderRoutes;