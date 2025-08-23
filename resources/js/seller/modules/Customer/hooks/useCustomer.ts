import { 
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useFetchCustomersQuery
} from '../store/customerApi';
import { useAppSelector } from '../../../store/store';
import { CreateCustomerPayload, UpdateCustomerPayload, DeleteCustomerPayload } from '../types';

const useCustomer = () => {
  // Fetch customers
  useFetchCustomersQuery();

  // Select customer state
  const {
    customers,
    meta,
  } = useAppSelector((state) => state.customer);

  // Create customer
  const [
    handleCreate,
    {
      isLoading: isCreateLoading,
      isError: isCreateError,
      error: createError,
      data: createData,
    },
  ] = useCreateCustomerMutation();

  const create = ({
    formData,
    onSuccess,
  }: {
    formData: CreateCustomerPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleCreate(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Update customer
  const [
    handleUpdate,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateCustomerMutation();

  const update = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateCustomerPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpdate(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Delete customer
  const [
    handleDelete,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  ] = useDeleteCustomerMutation();

  const deleteCustomer = ({
    formData,
    onSuccess,
  }: {
    formData: DeleteCustomerPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleDelete(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  return {
    customers,
    meta,

    create: {
      submit: create,
      isLoading: isCreateLoading,
      isError: isCreateError,
      error: createError,
      data: createData,
    },
    update: {
      submit: update,
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
    delete: {
      submit: deleteCustomer,
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  };
};

export default useCustomer;