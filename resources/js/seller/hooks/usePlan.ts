import {
    SubscribePayloadType,
    useFetchPlansQuery,
    useSubscribePlanMutation,
} from "@seller/store/reducers/subscriptionPlanApi";
import { useAppSelector } from "@seller/store/store";
import { useNavigate } from "react-router-dom";
import useToast from "./useToast";

const usePlans = () => {
    useFetchPlansQuery();

    const { toaster } = useToast();

    const navigate = useNavigate();

    // select plans
    const { plans } = useAppSelector((state) => state.plans);

    // subscribe plan
    const [
        handleSubscribePlan,
        {
            isLoading: isSubscribePlanLoading,
            isError: isSubscribePlanError,
            error: subscribePlanError,
            data: subscribePlanData,
        },
    ] = useSubscribePlanMutation();
    const subscribePlan = ({
        formData,
        onSuccess,
    }: {
        formData: SubscribePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleSubscribePlan(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                window.location.href = response.data.data.payment_url;
                toaster({
                    text: "Package subscription done",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to subscribe plan",
                    status: "error",
                });
            }
        });
    };

    return {
        plans,

        subscribePlan: {
            submit: subscribePlan,
            isLoading: isSubscribePlanLoading,
            isError: isSubscribePlanError,
            error: subscribePlanError,
            data: subscribePlanData,
        },
    };
};
export default usePlans;
