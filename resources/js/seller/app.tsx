import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/landing/notFound/page";
import { GuestMiddleware, LoggedMiddleware } from "./protectedRoutes";
import DashboardRoutes from "./routes/dashboardRoutes";
import GuestRoutes from "./routes/guestRoutes";
import OnboardRoutes from "./routes/onboardRoutes";

const App = () => {
    return (
        <>
            <BrowserRouter basename={"/seller"}>
                <Routes>
                    <Route path="onboard" element={<LoggedMiddleware />}>
                        <Route index path="*" element={<OnboardRoutes />} />
                    </Route>
                    <Route path="login" element={<GuestMiddleware />}>
                        <Route index path="*" element={<GuestRoutes />} />
                    </Route>

                    <Route path="/" element={<LoggedMiddleware />}>
                        <Route index path="/" element={<DashboardRoutes />} />
                        <Route index path="*" element={<DashboardRoutes />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
