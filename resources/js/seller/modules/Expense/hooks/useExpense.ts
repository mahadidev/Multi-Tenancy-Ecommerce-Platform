import { 
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useFetchExpensesQuery,
  useFetchVendorsQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation
} from '../store/expenseApi';
import { useAppSelector } from '../../../store/store';
import { 
  CreateExpensePayload, 
  UpdateExpensePayload, 
  DeleteExpensePayload,
  CreateVendorPayload,
  UpdateVendorPayload,
  DeleteVendorPayload
} from '../types';

const useExpense = () => {
  // Fetch expenses and vendors
  useFetchExpensesQuery();
  useFetchVendorsQuery();

  // Select state
  const { expenses, vendors, meta } = useAppSelector((state) => state.expense);

  // Expense mutations
  const [handleCreateExpense, createExpenseResult] = useCreateExpenseMutation();
  const [handleUpdateExpense, updateExpenseResult] = useUpdateExpenseMutation();
  const [handleDeleteExpense, deleteExpenseResult] = useDeleteExpenseMutation();

  // Vendor mutations
  const [handleCreateVendor, createVendorResult] = useCreateVendorMutation();
  const [handleUpdateVendor, updateVendorResult] = useUpdateVendorMutation();
  const [handleDeleteVendor, deleteVendorResult] = useDeleteVendorMutation();

  const createExpense = ({
    formData,
    onSuccess,
  }: {
    formData: CreateExpensePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCreateExpense(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  const updateExpense = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateExpensePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdateExpense(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  const deleteExpense = ({
    formData,
    onSuccess,
  }: {
    formData: DeleteExpensePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleDeleteExpense(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  const createVendor = ({
    formData,
    onSuccess,
  }: {
    formData: CreateVendorPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCreateVendor(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  const updateVendor = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateVendorPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdateVendor(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  const deleteVendor = ({
    formData,
    onSuccess,
  }: {
    formData: DeleteVendorPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleDeleteVendor(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  return {
    expenses,
    vendors,
    meta,

    expense: {
      create: {
        submit: createExpense,
        isLoading: createExpenseResult.isLoading,
        isError: createExpenseResult.isError,
        error: createExpenseResult.error,
        data: createExpenseResult.data,
      },
      update: {
        submit: updateExpense,
        isLoading: updateExpenseResult.isLoading,
        isError: updateExpenseResult.isError,
        error: updateExpenseResult.error,
        data: updateExpenseResult.data,
      },
      delete: {
        submit: deleteExpense,
        isLoading: deleteExpenseResult.isLoading,
        isError: deleteExpenseResult.isError,
        error: deleteExpenseResult.error,
        data: deleteExpenseResult.data,
      },
    },

    vendor: {
      create: {
        submit: createVendor,
        isLoading: createVendorResult.isLoading,
        isError: createVendorResult.isError,
        error: createVendorResult.error,
        data: createVendorResult.data,
      },
      update: {
        submit: updateVendor,
        isLoading: updateVendorResult.isLoading,
        isError: updateVendorResult.isError,
        error: updateVendorResult.error,
        data: updateVendorResult.data,
      },
      delete: {
        submit: deleteVendor,
        isLoading: deleteVendorResult.isLoading,
        isError: deleteVendorResult.isError,
        error: deleteVendorResult.error,
        data: deleteVendorResult.data,
      },
    },
  };
};

export default useExpense;