import usePlans from "@frontend/src/hooks/usePlans";
import { SubscriptionType } from "@type/subscriptionPlanType";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PricingSection = () => {
    const { plans } = usePlans();

    return (
        <div className="my-5 container">
            <div className="relative w-max mx-auto">
                <h1 className="w-max text-center text-2xl lg:text-5xl text-primary font-medium lg:leading-[58px]">
                    Choose{" "}
                    <span className="relative after:w-full after:h-[4px] after:absolute after:-z-10 after:left-0 after:bottom-2 after:bg-primary-light after:rounded-full">
                        Your Right
                    </span>{" "}
                    Plans
                </h1>
            </div>
            <br />
            <br />

            <div className="grid lg:grid-cols-3 gap-5">
                {plans?.map((plan: SubscriptionType, idx: number) => (
                    <div
                        key={idx}
                        className="bg-amber-50 flex flex-col p-5 rounded-xl shadow-md relative"
                    >
                        {plan?.is_trend ? (
                            <div className="absolute top-0 right-0 bg-[#1A453C] text-white w-[100px] h-[60px] text-xl font-semibold rounded-l-full flex items-center justify-center">
                                Best
                            </div>
                        ) : null}
                        <div className="grid items-center justify-between">
                            <h2 className="text-2xl font-medium my-2 text-[#1A453C]">
                                {plan?.name}
                            </h2>
                            <h3 className="text-xl font-medium text-[#1A453C] mb-2">
                                ${plan?.price_monthly} / Month
                            </h3>
                        </div>
                        <p className="text-md text-gray-500 my-2">
                            {plan?.title}
                        </p>
                        <div className="list-disc leading-8">
                            {plan?.features?.map((feature, idx: number) => (
                                <p
                                    key={idx}
                                    className="flex items-center gap-3"
                                >
                                    {feature?.is_available ? (
                                        <FaCheckCircle color="#1A453C" />
                                    ) : (
                                        <FaTimesCircle color="red" />
                                    )}
                                    {feature?.name}
                                </p>
                            ))}
                        </div>
                        <br />
                        <div className="text-center mt-auto">
                            <button className="w-full px-4 py-3 rounded-md bg-primary text-white font-medium hover:bg-primary-dark">
                                Select Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingSection;

// const PricingData = [
//     {
//         name: "Starter",
//         title: "Starter features",
//         price_monthly: 9.99,
//         features: [
//             { name: "1 Website", is_available: true },
//             { name: "1GB Storage", is_available: true },
//             { name: "Basic Templates", is_available: true },
//             { name: "Custom Domain", is_available: false },
//             { name: "E-commerce Features", is_available: false },
//             { name: "Standard Security", is_available: true },
//             { name: "Community Support", is_available: true },
//             { name: "SEO Tools", is_available: false },
//             { name: "Analytics Dashboard", is_available: false },
//             { name: "API Access", is_available: false },
//             { name: "Ad-Free Experience", is_available: false },
//             { name: "Multilingual Support", is_available: false },
//             { name: "User Roles & Permissions", is_available: false },
//         ],
//     },
//     {
//         name: "Pro",
//         title: "Pro features",
//         price_monthly: 19.99,
//         features: [
//             { name: "5 Websites", is_available: true },
//             { name: "10GB Storage", is_available: true },
//             { name: "Premium Templates", is_available: true },
//             { name: "Custom Domain", is_available: true },
//             { name: "E-commerce Features", is_available: false },
//             { name: "Enhanced Security", is_available: true },
//             { name: "Email Support", is_available: true },
//             { name: "Advanced SEO Tools", is_available: true },
//             { name: "Basic Analytics Dashboard", is_available: true },
//             { name: "API Access", is_available: false },
//             { name: "Ad-Free Experience", is_available: true },
//             { name: "Multilingual Support", is_available: false },
//             { name: "User Roles & Permissions", is_available: true },
//         ],
//     },
//     {
//         name: "Business",
//         title: "Business features",
//         price_monthly: 49.99,
//         features: [
//             { name: "Unlimited Websites", is_available: true },
//             { name: "100GB Storage", is_available: true },
//             { name: "Premium Templates", is_available: true },
//             { name: "Custom Domain", is_available: true },
//             { name: "E-commerce Features", is_available: true },
//             { name: "Priority Security", is_available: true },
//             { name: "Live Chat Support", is_available: true },
//             { name: "Full SEO Suite", is_available: true },
//             { name: "Advanced Analytics Dashboard", is_available: true },
//             { name: "API Access", is_available: true },
//             { name: "Blogging Tools", is_available: true },
//             { name: "Mobile Optimization", is_available: true },
//             { name: "Ad-Free Experience", is_available: true },
//             { name: "Multilingual Support", is_available: true },
//             { name: "User Roles & Permissions", is_available: true },
//         ],
//     },
// ];
