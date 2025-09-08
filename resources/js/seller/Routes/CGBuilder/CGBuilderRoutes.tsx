import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { 
    CGBuilderDashboard,
    CGBuilderDashboardWithSidebar,
    CGBuilderPagesList,
    CGBuilderLayoutsList,
    CGBuilderPageBuilder,
    CGBuilderLayoutBuilder,
    CGBuilderMenusPage
} from '../../modules/WebsiteBuilder/cgbuilder';
import { ThemeMarketplace, ElementorBuilderPage } from '../../modules/WebsiteBuilder/pages';

export const CGBuilderRoutes = (
    <Fragment>
        {/* CG Builder Routes - Independent from Dashboard Layout */}
        <Route path="cg-builder" element={<CGBuilderDashboardWithSidebar />} />
        <Route path="cg-builder/pages" element={<CGBuilderPagesList />} />
        <Route path="cg-builder/layouts" element={<CGBuilderLayoutsList />} />
        <Route path="website-builder/themes" element={<ThemeMarketplace />} />
        <Route path="cg-builder/page" element={<CGBuilderPageBuilder />} />
        <Route path="cg-builder/page/:pageId" element={<CGBuilderPageBuilder />} />
        <Route path="cg-builder/layout" element={<CGBuilderLayoutBuilder />} />
        <Route path="cg-builder/header" element={<CGBuilderLayoutBuilder type="header" />} />
        <Route path="cg-builder/footer" element={<CGBuilderLayoutBuilder type="footer" />} />
        <Route path="cg-builder/menus" element={<CGBuilderMenusPage />} />
        
        {/* Elementor Builder Routes */}
        <Route path="cg-builder/elementor" element={<ElementorBuilderPage />} />
        <Route path="cg-builder/elementor/:pageId" element={<ElementorBuilderPage />} />
    </Fragment>
);