import { Route, Routes } from "react-router-dom";
import { AuthLayout } from "../components";
import SignInPage from "../pages/authentication/singIn";
import SignUpPage from "../pages/authentication/singup";

export default function GuestRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AuthLayout />}>
                {/* Authentication pages start */}
                <Route index element={<SignInPage />} />
                <Route path="create" index element={<SignUpPage />} />
                {/* Authentication pages end */}
            </Route>
        </Routes>
    );
}
