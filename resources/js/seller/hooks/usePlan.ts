import {
    SubscribePayloadType,
    SubscribeSuccessPayloadType,
    useFetchPlansQuery,
    useSubscribePlanMutation,
    useSubscribeVerifyMutation,
} from "@seller/store/reducers/subscriptionPlanApi";
import { useAppSelector } from "@seller/store/store";
import useToast from "./useToast";

const usePlans = () => {
	useFetchPlansQuery();

	const { toaster } = useToast();

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
			}
		});
	};

	// subscribe plan success
	const [
		handleSubscribePlanSuccess,
		{
			isLoading: isSubscribePlanSuccessLoading,
			isError: isSubscribePlanSuccessError,
			error: subscribePlanSuccessError,
			data: subscribePlanSuccessData,
			isSuccess: isVerifySuccess,
		},
	] = useSubscribeVerifyMutation();

	const subscribePlanSuccess = ({
		formData,
		onSuccess,
	}: {
		formData: SubscribeSuccessPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleSubscribePlanSuccess(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
				window.location.href = response.data.data.payment_url;

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
		verify: {
			submit: subscribePlanSuccess,
			isLoading: isSubscribePlanSuccessLoading,
			isError: isSubscribePlanSuccessError,
			error: subscribePlanSuccessError,
			data: subscribePlanSuccessData,
			isSuccess: isVerifySuccess,
		},
	};
};
export default usePlans;
