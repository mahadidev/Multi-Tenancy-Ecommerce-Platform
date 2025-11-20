import {
    useFetchPlansQuery,
    useSubscribePlanMutation
} from "@seller/modules/Subscription/store";
import type { SubscribePayload } from "@seller/modules/Subscription/types";
import { useAppSelector } from "@seller/store/store";

const usePlans = () => {
	const queryResult = useFetchPlansQuery();
	const { data } = queryResult;

	// select plans from the OLD slice
	const { plans: legacyPlans } = useAppSelector((state) => state.subscriptionPlan);
	// select plans from the NEW slice  
	const { plans: newPlans } = useAppSelector((state) => state.subscription);


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
		formData: SubscribePayload;
		onSuccess?: CallableFunction;
	}) => {
		handleSubscribePlan(formData).then((response) => {
			if (response.data?.status === 200 || response.data?.success) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
				// Handle payment URL (redirect to payment gateway)
				if (response.data.data.payment_url) {
					window.location.href = response.data.data.payment_url;
				} else if ((response.data.data as any).redirect_url) {
					window.location.href = (response.data.data as any).redirect_url;
				} else {
					// If no redirect, log success
					console.log('Subscription successful:', response.data);
				}
			}
		});
	};


	// Use any available plans data - prefer new, then legacy, then API
	const finalPlans = (newPlans && newPlans.length > 0) ? newPlans : 
	                   (legacyPlans && legacyPlans.length > 0) ? legacyPlans :
	                   (data?.data?.plans || []);

	return {
		plans: finalPlans,

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
