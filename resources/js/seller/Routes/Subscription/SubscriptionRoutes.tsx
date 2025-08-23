import { Route } from 'react-router-dom';
import { 
    SelectSubscriptionPage,
    SubscriptionCancelledPage, 
    SubscriptionFailedPage, 
    SubscriptionSuccessPage 
} from '../../modules/Subscription/pages';
import SubscriptionLayout from '../../components/Layout/SubscriptionLayout';

export const SubscriptionRoutes = (
    <Route path="/" element={<SubscriptionLayout />}>
        <Route path="/select-subscriptions" element={<SelectSubscriptionPage />} />
        <Route path="subscription-success" element={<SubscriptionSuccessPage />} />
        <Route path="subscription-failed" element={<SubscriptionFailedPage />} />
        <Route path="subscription-cancelled" element={<SubscriptionCancelledPage />} />
    </Route>
);