import { HeroSection, IntroSection } from "@frontend/src/components";
import AboutUs from "../components/sections/AboutUs";
import ContactUs from "../components/sections/ContactUs";
import PricingSection from "../components/sections/PricingSection";

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <IntroSection />
            <br />
            <br />
            <AboutUs />
            <br />
            <br />
            <br />
            <PricingSection />
            <br />
            <br />
            <br />
            <ContactUs />
        </>
    );
};

export default HomePage;
