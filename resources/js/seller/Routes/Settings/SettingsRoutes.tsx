import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { SettingsPage } from '../../modules/Settings/pages';
import { ProfileSettingsPage } from '../../modules/Profile/pages';
import { ThemesPage } from '../../modules/Theme/pages';
import { NotificationsPage } from '../../modules/Notification/pages';
import { StoresPage, CreateStorePage } from '../../modules/Store/pages';
import { AnalyticsPage, ProductStockAnalyticsPage } from '../../modules/Analytics/pages';

export const SettingsRoutes = (
    <Fragment>
        <Route path="settings" element={<SettingsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="analytics/product-stock" element={<ProductStockAnalyticsPage />} />
        <Route path="themes" element={<ThemesPage />} />
        <Route path="my-account/profile-settings" element={<ProfileSettingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="stores" element={<StoresPage />} />
        <Route path="stores/create" element={<CreateStorePage />} />
    </Fragment>
);