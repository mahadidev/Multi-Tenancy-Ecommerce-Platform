import useToast from "@seller/_hooks/useToast";
import { useAppDispatch, useAppSelector } from "@seller/store/store";
import { useNavigate } from "react-router-dom";
import {
    useCreateStoreMutation,
    useGetOnboardStatusQuery,
    useGetStoreCategoriesQuery,
    useSubmitOnboardStepMutation,
} from "../store/onboardApi";
import {
    addCompletedStep,
    clearOnboardData,
    nextStep,
    previousStep,
    setCurrentStep,
    setStoreData,
} from "../store/onboardSlice";
import { CreateStorePayload, OnboardStepPayload, StepOneFormData, StepThreeFormData, StepTwoFormData } from "../types";

const useOnboard = () => {
  const { toaster } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Select onboard state
  const onboardState = useAppSelector((state) => state.onboard);

  // Get onboard status
  const {
    data: onboardStatusData,
    isLoading: isFetchingStatus,
    error: fetchStatusError
  } = useGetOnboardStatusQuery();

  // Get store categories
  const {
    data: storeCategoriesData,
    isLoading: isFetchingCategories,
    error: fetchCategoriesError
  } = useGetStoreCategoriesQuery();

  // Submit onboard step
  const [
    handleSubmitStep,
    {
      isLoading: isSubmittingStep,
      isError: isSubmitStepError,
      error: submitStepError,
      data: submitStepData,
    },
  ] = useSubmitOnboardStepMutation();

  const submitStep = ({
    step,
    formData,
    onSuccess,
  }: {
    step: number;
    formData: StepOneFormData | StepTwoFormData | StepThreeFormData;
    onSuccess?: CallableFunction;
  }) => {
    const payload: OnboardStepPayload = { step, data: formData };

    handleSubmitStep(payload).then((response) => {
      if (response.data?.status === 200) {
        dispatch(addCompletedStep(step));
        dispatch(setStoreData(formData));

        toaster({
          text: `Step ${step} completed successfully`,
          status: "success",
        });

        if (step < 3) {
          dispatch(nextStep());
        }

        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Create store (final step)
  const [
    handleCreateStore,
    {
      isLoading: isCreatingStore,
      isError: isCreateStoreError,
      error: createStoreError,
      data: createStoreData,
    },
  ] = useCreateStoreMutation();

  const createStore = ({
    formData,
    onSuccess,
  }: {
    formData: CreateStorePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCreateStore(formData).then((response) => {
      if (response.data?.status === 200) {
        toaster({
          text: "Store created successfully!",
          status: "success",
          description: "Welcome to your new store!",
        });

        dispatch(clearOnboardData());
        navigate("/dashboard");

        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Navigation helpers
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      dispatch(setCurrentStep(step));
    }
  };

  const goToNextStep = () => {
    dispatch(nextStep());
  };

  const goToPreviousStep = () => {
    dispatch(previousStep());
  };

  const updateStoreData = (data: Partial<any>) => {
    dispatch(setStoreData(data));
  };

  return {
    // State
    currentStep: onboardState.currentStep,
    storeData: onboardState.storeData,
    completedSteps: onboardState.completedSteps,
    loading: onboardState.loading,
    error: onboardState.error,

    // Data
    onboardStatus: onboardStatusData,
    isFetchingStatus,
    fetchStatusError,

    storeCategories: storeCategoriesData?.data || [],
    isFetchingCategories,
    fetchCategoriesError,

    // Submit step
    submitStep: {
      submit: submitStep,
      isLoading: isSubmittingStep,
      isError: isSubmitStepError,
      error: submitStepError,
      data: submitStepData,
    },

    // Create store
    createStore: {
      submit: createStore,
      isLoading: isCreatingStore,
      isError: isCreateStoreError,
      error: createStoreError,
      data: createStoreData,
    },

    // Navigation helpers
    goToStep,
    goToNextStep,
    goToPreviousStep,
    updateStoreData,
  };
};

export default useOnboard;
