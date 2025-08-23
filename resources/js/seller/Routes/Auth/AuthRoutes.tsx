import { Route } from 'react-router-dom';
import { AuthLayout } from '../../components';
import {
    LoginPage,
    RegisterPage,
    EmailVerificationPage,
    ForgotPassword,
    ForgotPasswordSuccess,
    ResetPassword,
    SocialMediaPage
} from '../../modules/Auth/pages';

export const AuthRoutes = (
    <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<EmailVerificationPage />} />
        <Route path="social-media" element={<SocialMediaPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="forgot-password-success" element={<ForgotPasswordSuccess />} />
        <Route path="reset-password" element={<ResetPassword />} />
    </Route>
);