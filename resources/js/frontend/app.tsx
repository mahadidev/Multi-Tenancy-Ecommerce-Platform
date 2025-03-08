import { Layout } from "@frontend/src/components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./src/pages";
import AboutUsPage from "./src/pages/about-us";
import ContactUsPage from "./src/pages/contact-us";
import PricingPage from "./src/pages/pricing";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/about-us" element={<AboutUsPage />} />
                        <Route path="/contact-us" element={<ContactUsPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
