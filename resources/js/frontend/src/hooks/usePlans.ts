import { subscriptionPlanApi } from "../store/reducers/subscriptionPlanApi";
import { useAppSelector } from "../store/store";

const usePlans = () => {
    // select plans
    const { plans } = useAppSelector((state) => state.plans);
    // fetch plans
    const [
        handleFetchPlans,
        {
            isLoading: isFetchPlansLoading,
            isError: isFetchPlansError,
            error: fetchPlansError,
            data: fetchPlansData,
        },
    ] = subscriptionPlanApi.endpoints.fetchPlans.useLazyQuery();
    const fetchPlans = () => {
        handleFetchPlans().then();
    };

    return {
        plans,

        fetchPlans: {
            submit: fetchPlans,
            isLoading: isFetchPlansLoading,
            isError: isFetchPlansError,
            error: fetchPlansError,
            data: fetchPlansData,
        },
    };
};
export default usePlans;
