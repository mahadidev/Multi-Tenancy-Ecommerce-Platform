import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import usePlans from "@seller/hooks/usePlan";
import { SubscriptionType } from "@type/subscriptionPlanType";
import { FC } from "react";
import { useSearchParams } from "react-router-dom";
import SubscriptionPlan from "./SubscriptionPlan";

const UpgradeSubscriptionPlan: FC = function () {
    const { plans } = usePlans();
    const [params] = useSearchParams();

    const status = params.get("status");

    return (
        <>
            <div className="block items-center justify-between border-b border-gray-200 bg-white sm:flex dark:border-gray-700 dark:bg-gray-800">
                <PageBreadCrumb title="All Plans" items={["Upgrade Plan"]} />
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        {/* status */}

                        {/* <SubscriptionSuccessModal status={status!} /> */}

                        <div className="overflow-hidden shadow">
                            <div className="grid lg:grid-cols-3 gap-5 p-4">
                                {plans?.map(
                                    (plan: SubscriptionType, idx: number) => (
                                        <SubscriptionPlan
                                            key={idx}
                                            plan={plan}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpgradeSubscriptionPlan;
