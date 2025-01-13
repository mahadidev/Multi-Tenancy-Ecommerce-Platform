import { Benefits, FAQ, PricingPlan } from "./sections";

export default function PricingPage() {
    return (
        <>
            <div className="container mx-auto px-4 pt-12 lg:px-0 dark:bg-gray-900">
                <PricingPlan />
                <Benefits />
                <FAQ />
            </div>
        </>
    );
}
