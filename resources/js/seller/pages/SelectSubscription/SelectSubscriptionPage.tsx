import usePlans from "@seller/hooks/usePlan";
import { SubscriptionType } from "@type/subscriptionPlanType";
import { FC } from "react";
import SubscriptionPlan from "../SubscriptionPlan/SubscriptionPlan";

const SelectSubscriptionPage: FC = () => {
    const { plans } = usePlans();
    return (
        <div className="flex flex-col items-center h-screen justify-center !w-full">
            <div className="relative mx-auto py-5 md:py-0 my-5">
                <h1 className="w-max text-center text-3xl lg:text-5xl text-primary font-medium lg:leading-[58px]">
                    Choose{" "}
                    <span className="relative after:w-full after:h-[4px] after:absolute after:-z-10 after:left-0 after:bottom-2 after:bg-primary-light after:rounded-full">
                        Your Right
                    </span>{" "}
                    Plans
                </h1>
            </div>

            <div className="overflow-x-auto w-full">
                <div className="container mx-auto">
                    {/* <SubscriptionSuccessModal status={status!} /> */}
                    <div className="overflow-hidden">
                        <div className="grid lg:grid-cols-3 gap-5 p-4">
                            {plans?.map(
                                (plan: SubscriptionType, idx: number) => (
                                    <SubscriptionPlan key={idx} plan={plan} />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectSubscriptionPage;
