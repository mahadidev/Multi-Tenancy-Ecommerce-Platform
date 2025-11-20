import usePlans from "@seller/_hooks/usePlan";
import { FC } from "react";
import { useSearchParams } from "react-router-dom";
import SubscriptionPlan from "./SubscriptionPlan";

const SelectSubscriptionPage: FC = () => {
    const { plans } = usePlans();

    const [params] = useSearchParams();
    const actionParam = params.get("action");

    return (
        <div className="flex flex-col items-center h-screen justify-center !w-full">
            <div className="relative mx-auto py-5 md:py-0 my-5">
                <h1 className="w-max text-center text-3xl lg:text-5xl dark:text-white  font-medium lg:leading-[58px]">
                    {actionParam === "upgrade" ? "Upgrade" : "Choose"}{" "}
                    <span className="relative after:w-full after:h-[4px] after:absolute after:-z-10 after:left-0 after:bottom-2 after:bg-primary-light after:rounded-full">
                        Your {actionParam === "upgrade" ? "" : "Right"}
                    </span>{" "}
                    Plans
                </h1>
            </div>

            <div className="overflow-x-auto w-full">
                <div className="container mx-auto">
                    {/* <SubscriptionSuccessModal status={status!} /> */}
                    <div className="overflow-hidden">
                        <div className="grid lg:grid-cols-3 gap-5 p-4">
                            {plans && Array.isArray(plans) && plans.length > 0 ? (
                                plans.map((plan, idx: number) => (
                                    <SubscriptionPlan key={idx} plan={plan} />
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-8">
                                    <p className="text-gray-500 text-lg">
                                        {plans === null ? 'Loading plans...' : 'No subscription plans found'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectSubscriptionPage;
