import useToast from "@seller/_hooks/useToast";
import { useAppDispatch, useAppSelector } from "@seller/store/store";
import {
    PlaceholderCreatePayload,
    PlaceholderFilters,
    PlaceholderUpdatePayload,
    useCreatePlaceholderMutation,
    useDeletePlaceholderMutation,
    useGetPlaceholderQuery,
    useGetPlaceholdersQuery,
    useTogglePlaceholderMutation,
    useUpdatePlaceholderMutation,
} from "../store/placeholdersApi";
import {
    clearFilters,
    setFilters,
    setSelectedPlaceholder,
} from "../store/placeholdersSlice";

const usePlaceholders = () => {
  const { toaster } = useToast();
  const dispatch = useAppDispatch();

  // Select placeholders state
  const placeholdersState = useAppSelector((state) => state.placeholders);

  // Get placeholders
  const {
    data: placeholdersData,
    isLoading: isFetchingPlaceholders,
    error: fetchPlaceholdersError,
    refetch: refetchPlaceholders,
  } = useGetPlaceholdersQuery(placeholdersState.filters);

  // Get single placeholder
  const getPlaceholder = (id: number | string) => {
    return useGetPlaceholderQuery({ id });
  };

  // Create placeholder
  const [
    handleCreatePlaceholder,
    {
      isLoading: isCreatingPlaceholder,
      isError: isCreatePlaceholderError,
      error: createPlaceholderError,
      data: createPlaceholderData,
    },
  ] = useCreatePlaceholderMutation();

  const createPlaceholder = ({
    formData,
    onSuccess,
  }: {
    formData: PlaceholderCreatePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCreatePlaceholder(formData).then((response) => {
      if (response.data?.status === 200) {
        toaster({
          text: "Placeholder created successfully",
          status: "success",
        });
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Update placeholder
  const [
    handleUpdatePlaceholder,
    {
      isLoading: isUpdatingPlaceholder,
      isError: isUpdatePlaceholderError,
      error: updatePlaceholderError,
      data: updatePlaceholderData,
    },
  ] = useUpdatePlaceholderMutation();

  const updatePlaceholder = ({
    formData,
    onSuccess,
  }: {
    formData: PlaceholderUpdatePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdatePlaceholder(formData).then((response) => {
      if (response.data?.status === 200) {
        toaster({
          text: "Placeholder updated successfully",
          status: "success",
        });
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Delete placeholder
  const [
    handleDeletePlaceholder,
    {
      isLoading: isDeletingPlaceholder,
      isError: isDeletePlaceholderError,
      error: deletePlaceholderError,
      data: deletePlaceholderData,
    },
  ] = useDeletePlaceholderMutation();

  const deletePlaceholder = ({
    id,
    onSuccess,
  }: {
    id: number | string;
    onSuccess?: CallableFunction;
  }) => {
    handleDeletePlaceholder({ id }).then((response) => {
      if (response.data?.status === 200) {
        toaster({
          text: "Placeholder deleted successfully",
          status: "success",
        });
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Toggle placeholder status
  const [
    handleTogglePlaceholder,
    {
      isLoading: isTogglingPlaceholder,
      isError: isTogglePlaceholderError,
      error: togglePlaceholderError,
      data: togglePlaceholderData,
    },
  ] = useTogglePlaceholderMutation();

  const togglePlaceholder = ({
    id,
    onSuccess,
  }: {
    id: number | string;
    onSuccess?: CallableFunction;
  }) => {
    handleTogglePlaceholder({ id }).then((response) => {
      if (response.data?.status === 200) {
        toaster({
          text: "Placeholder status updated successfully",
          status: "success",
        });
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Filter helpers
  const updateFilters = (newFilters: Partial<PlaceholderFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  // Selection helpers
  const selectPlaceholder = (placeholder: any) => {
    dispatch(setSelectedPlaceholder(placeholder));
  };

  const clearSelection = () => {
    dispatch(setSelectedPlaceholder(null));
  };

  return {
    // State
    placeholders: placeholdersData?.data?.placeholders || [],
    selectedPlaceholder: placeholdersState.selectedPlaceholder,
    meta: placeholdersData?.data?.meta || placeholdersState.meta,
    filters: placeholdersState.filters,
    loading: placeholdersState.loading,
    error: placeholdersState.error,

    // Fetch placeholders
    isFetchingPlaceholders,
    fetchPlaceholdersError,
    refetchPlaceholders,

    // Get single placeholder
    getPlaceholder,

    // Create placeholder
    createPlaceholder: {
      submit: createPlaceholder,
      isLoading: isCreatingPlaceholder,
      isError: isCreatePlaceholderError,
      error: createPlaceholderError,
      data: createPlaceholderData,
    },

    // Update placeholder
    updatePlaceholder: {
      submit: updatePlaceholder,
      isLoading: isUpdatingPlaceholder,
      isError: isUpdatePlaceholderError,
      error: updatePlaceholderError,
      data: updatePlaceholderData,
    },

    // Delete placeholder
    deletePlaceholder: {
      submit: deletePlaceholder,
      isLoading: isDeletingPlaceholder,
      isError: isDeletePlaceholderError,
      error: deletePlaceholderError,
      data: deletePlaceholderData,
    },

    // Toggle placeholder
    togglePlaceholder: {
      submit: togglePlaceholder,
      isLoading: isTogglingPlaceholder,
      isError: isTogglePlaceholderError,
      error: togglePlaceholderError,
      data: togglePlaceholderData,
    },

    // Helpers
    updateFilters,
    resetFilters,
    selectPlaceholder,
    clearSelection,
  };
};

export default usePlaceholders;
