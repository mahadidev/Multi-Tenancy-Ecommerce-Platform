import { 
  useSubscribePlanMutation,
  useCancelSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useFetchPlansQuery
} from '../store/subscriptionApi';
import { useAppSelector } from '../../../store/store';
import { 
  SubscribePayload, 
  CancelSubscriptionPayload, 
  UpdateSubscriptionPayload 
} from '../types';

const useSubscription = () => {
  // Fetch plans
  useFetchPlansQuery();

  // Select subscription state
  const {
    plans,
    selectedPlan,
    currentSubscription,
    meta,
  } = useAppSelector((state) => state.subscription);

  // Subscribe to plan
  const [
    handleSubscribe,
    {
      isLoading: isSubscribeLoading,
      isError: isSubscribeError,
      error: subscribeError,
      data: subscribeData,
    },
  ] = useSubscribePlanMutation();

  const subscribePlan = ({
    formData,
    onSuccess,
  }: {
    formData: SubscribePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleSubscribe(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        // Redirect to payment URL if provided
        if (response.data.data.payment_url) {
          window.location.href = response.data.data.payment_url;
        }
      }
    });
  };

  // Cancel subscription
  const [
    handleCancel,
    {
      isLoading: isCancelLoading,
      isError: isCancelError,
      error: cancelError,
      data: cancelData,
    },
  ] = useCancelSubscriptionMutation();

  const cancelSubscription = ({
    formData,
    onSuccess,
  }: {
    formData: CancelSubscriptionPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCancel(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Update subscription
  const [
    handleUpdate,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateSubscriptionMutation();

  const updateSubscription = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateSubscriptionPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdate(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  return {
    plans,
    selectedPlan,
    currentSubscription,
    meta,

    subscribePlan: {
      submit: subscribePlan,
      isLoading: isSubscribeLoading,
      isError: isSubscribeError,
      error: subscribeError,
      data: subscribeData,
    },
    cancel: {
      submit: cancelSubscription,
      isLoading: isCancelLoading,
      isError: isCancelError,
      error: cancelError,
      data: cancelData,
    },
    update: {
      submit: updateSubscription,
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  };
};

export default useSubscription;