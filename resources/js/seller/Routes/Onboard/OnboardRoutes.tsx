import { Route } from 'react-router-dom';
import { StoreOnboardPage } from '../../modules/Onboard/pages';
import { AuthLayout } from '../../components';

export const OnboardRoutes = (
    <Route path="onboard" element={<AuthLayout />}>
        <Route path="store" element={<StoreOnboardPage />} />
    </Route>
);