import usePlans from "@frontend/src/hooks/usePlans";
import { SubscriptionType } from "@type/subscriptionPlanType";
import { Button } from "flowbite-react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const SubscriptionPlans = () => {
    const { plans } = usePlans();
    return (
        <div className="grid lg:grid-cols-3 gap-5 p-4">
            {plans?.map((plan: SubscriptionType, idx: number) => (
                <div
                    key={idx}
                    className="dark:bg-gray-800 bg-gray-100 flex flex-col p-5 rounded-xl shadow-md relative"
                >
                    {plan?.is_trend ? (
                        <div className="absolute top-0 right-0 text-white w-[100px] h-[60px] text-xl font-semibold rounded-l-full flex items-center justify-center dark:text-white bg-blue-600">
                            Best
                        </div>
                    ) : null}
                    <div className="grid items-center justify-between">
                        <h2 className="text-2xl font-medium my-2 dark:text-white">
                            {plan?.name}
                        </h2>
                        <h3 className="text-xl font-medium mb-2 dark:text-white">
                            ${plan?.price_monthly} / Month
                        </h3>
                    </div>
                    <p className="text-md dark:text-gray-300 my-2">
                        {plan?.title}
                    </p>
                    <div className="list-disc leading-8">
                        {plan?.features?.map((feature, idx: number) => (
                            <p
                                key={idx}
                                className="flex items-center gap-3 dark:text-gray-300"
                            >
                                {feature?.is_available ? (
                                    <FaCheckCircle className="text-blue-600" />
                                ) : (
                                    <FaTimesCircle color="red" />
                                )}
                                {feature?.name}
                            </p>
                        ))}
                    </div>
                    <br />
                    <div className="text-center mt-auto">
                        {idx === 1 ? (
                            <Button
                                disabled
                                className="w-full px-4 py-3 rounded-md text-white font-medium"
                                color="primary"
                            >
                                Current Plan
                            </Button>
                        ) : (
                            <Button
                                color="blue"
                                className="w-full px-4 py-3 rounded-md text-white font-medium"
                            >
                                Select Now
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SubscriptionPlans;
