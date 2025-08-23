import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { AccessManagementPage } from '../../modules/AccessManagement/pages';
import { StoreAdminPage } from '../../modules/Store/pages';

export const UsersRoutes = (
    <Fragment>
        <Route path="access-management" element={<AccessManagementPage />} />
        <Route path="store-admin" element={<StoreAdminPage />} />
    </Fragment>
);