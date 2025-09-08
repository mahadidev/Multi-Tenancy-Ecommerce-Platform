import { Fragment } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { 
    WebsiteManagementPage,
    WebsiteSettingsPage,
    WebsiteMenusPage,
    WebsitePagesPage,
    WebsiteBuilderPage,
    ThemeMarketplace,
    ThemeCustomizer,
    ElementorBuilderPage
} from '../../modules/WebsiteBuilder/pages';

export const WebsiteBuilderRoutes = (
    <Fragment>
        {/* Redirect main website management to CG Builder */}
        <Route path="websites" element={<Navigate to="/cg-builder" replace />} />
        
        {/* Legacy page builder routes redirected to CG Builder */}
        <Route path="websites/:websiteId/pages/:pageId/builder" element={<Navigate to="/cg-builder/page/:websiteId/:pageId" replace />} />
        <Route path="websites/:websiteId/builder" element={<Navigate to="/cg-builder/page" replace />} />
        
        {/* Legacy Elementor Builder routes redirected to CG Builder */}
        <Route path="websites/:websiteId/pages/:pageId/elementor" element={<ElementorBuilderPage />} />
        <Route path="websites/:websiteId/elementor" element={<ElementorBuilderPage />} />
        
        {/* Legacy theme customizer redirect */}
        <Route path="website-builder/themes/:themeId/customize" element={<Navigate to="/cg-builder" replace />} />
        
        {/* Legacy builder tools redirects */}
        <Route path="website-builder/layout" element={<Navigate to="/cg-builder/layout" replace />} />
        <Route path="website-builder/header" element={<Navigate to="/cg-builder/header" replace />} />
        <Route path="website-builder/footer" element={<Navigate to="/cg-builder/footer" replace />} />
        
        {/* Legacy website management routes redirected to CG Builder */}
        <Route path="websites/:websiteId/settings" element={<Navigate to="/cg-builder" replace />} />
        <Route path="websites/:websiteId/menus" element={<Navigate to="/cg-builder" replace />} />
        <Route path="websites/:websiteId/pages" element={<Navigate to="/cg-builder" replace />} />
        
        {/* Redirect any remaining website routes to CG Builder */}
        <Route path="websites/:websiteId" element={<Navigate to="/cg-builder" replace />} />
    </Fragment>
);