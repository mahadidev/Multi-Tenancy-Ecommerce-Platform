// Main management pages
export { default as WebsiteManagementPage } from './WebsiteManagementPage';
export { default as WebsiteSettingsPage } from './WebsiteSettingsPage';
export { default as WebsiteMenusPage } from './WebsiteMenusPage';
export { default as WebsitePagesPage } from './WebsitePagesPage';
export { default as WebsiteBuilderPage } from './WebsiteBuilderPage';

// Theme management pages
export { ThemeMarketplace } from './ThemeMarketplace';
export { ThemeCustomizer } from './ThemeCustomizer';

// Builder pages
export { HeaderBuilderPage } from './HeaderBuilderPage';
export { FooterBuilderPage } from './FooterBuilderPage';
export { LayoutBuilderPage } from './LayoutBuilderPage';
export { ElementorBuilderPage } from './ElementorBuilderPage';

// CG Builder exports
export { 
  CGBuilderDashboard,
  CGBuilderPageBuilder,
  CGBuilderLayoutBuilder
} from '../cgbuilder';

// Legacy exports (keeping for backwards compatibility)
export { default as WebsiteCreatePage } from './WebsiteCreatePage';
export { default as WebsiteEditPage } from './WebsiteEditPage';
export { default as PageBuilderPage } from './PageBuilderPage';