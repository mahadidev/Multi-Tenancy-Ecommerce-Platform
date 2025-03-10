import { useFetchPlansQuery } from "../store/reducers/subscriptionPlanApi";
import { useAppSelector } from "../store/store";

const usePlans = () => {
    useFetchPlansQuery();

    // select plans
    const { plans } = useAppSelector((state) => state.plans);

    return {
        plans,
    };
};
export default usePlans;
