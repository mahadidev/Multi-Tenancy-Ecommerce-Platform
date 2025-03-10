import { useFetchPlansQuery } from "@seller/store/reducers/subscriptionPlanApi";
import { useAppSelector } from "@seller/store/store";

const usePlans = () => {
    useFetchPlansQuery();

    // select plans
    const { plans } = useAppSelector((state) => state.plans);

    return {
        plans,
    };
};
export default usePlans;
