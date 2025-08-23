import { Fragment } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { 
    WebsiteManagementPage,
    WebsiteSettingsPage,
    WebsiteMenusPage,
    WebsitePagesPage,
    WebsiteBuilderPage
} from '../../modules/WebsiteBuilder/pages';

export const WebsiteBuilderRoutes = (
    <Fragment>
        {/* Main website management dashboard */}
        <Route path="websites" element={<WebsiteManagementPage />} />
        
        {/* Website settings */}
        <Route path="websites/:websiteId/settings" element={<WebsiteSettingsPage />} />
        
        {/* Website menus */}
        <Route path="websites/:websiteId/menus" element={<WebsiteMenusPage />} />
        
        {/* Website pages */}
        <Route path="websites/:websiteId/pages" element={<WebsitePagesPage />} />
        
        {/* Page builder */}
        <Route path="websites/:websiteId/pages/:pageId/builder" element={<WebsiteBuilderPage />} />
        <Route path="websites/:websiteId/builder" element={<WebsiteBuilderPage />} />
        
        {/* Redirect /websites/:id to main dashboard (must be last to avoid matching other routes) */}
        <Route path="websites/:websiteId" element={<Navigate to="/websites" replace />} />
    </Fragment>
);