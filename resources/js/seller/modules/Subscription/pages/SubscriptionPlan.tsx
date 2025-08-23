import usePlans from "@seller/_hooks/usePlan";
import useStore from "@seller/_hooks/useStore";
import type { SubscriptionPlan as SubscriptionPlanType } from "../types";
import { Button } from "flowbite-react";
import { FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";

const SubscriptionPlan: FC<{ plan: SubscriptionPlanType }> = ({ plan }) => {
    const { subscribePlan } = usePlans();
    const { store } = useStore();

    return (
        <div className="dark:bg-gray-800 bg-gray-100 flex flex-col p-5 rounded-xl shadow-md relative">
            {plan?.is_popular ? (
                <div className="absolute top-0 right-0 text-white w-[100px] h-[60px] text-xl font-semibold rounded-l-full flex items-center justify-center dark:text-white bg-blue-600">
                    Best
                </div>
            ) : null}
            <div className="grid items-center justify-between">
                <h2 className="capitalize text-2xl font-medium my-2 dark:text-white">
                    {plan?.name}
                </h2>
                <h3 className="text-xl font-medium mb-2 dark:text-white">
                    ${plan?.price} / Month
                </h3>
            </div>
            <p className="text-md dark:text-gray-300 my-2">{plan?.description}</p>
            <div className="list-disc leading-8">
                {plan?.features?.map((featureName, idx: number) => (
                    <p
                        key={idx}
                        className="flex items-center gap-3 dark:text-gray-300"
                    >
                        <FaCheckCircle className="text-blue-600" />
                        {featureName}
                    </p>
                ))}
            </div>
            <br />
            <div className="text-center mt-auto">
                <Button
                    color="blue"
                    className="w-full px-4 py-3 rounded-md text-white font-medium"
                    onClick={() =>
                        subscribePlan.submit({
                            formData: {
                                package_id: plan?.id,
                                amount: plan?.price,
                            },
                        })
                    }
                    isProcessing={subscribePlan.isLoading}
                    disabled={
                        subscribePlan.isLoading ||
                        store?.store_subscription_plan?.package?.name ===
                            plan?.name
                    }
                    processingSpinner={
                        <AiOutlineLoading className="h-6 w-6 animate-spin" />
                    }
                >
                    Subscribe Now
                </Button>
            </div>
        </div>
    );
};

export default SubscriptionPlan;
