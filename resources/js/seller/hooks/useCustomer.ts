import {
    useCreateCustomerMutation,
    useFetchCustomersQuery,
    useUpdateCustomerMutation,
} from "@seller/store/reducers/customerApi";
import { useAppSelector } from "@seller/store/store";
import { CustomerType } from "@type/customersType";
import useToast from "./useToast";

const useCustomer = () => {
    // fetch customers
    useFetchCustomersQuery();

    const { toaster } = useToast();

    // select customers
    const { customers } = useAppSelector((state) => state.customer);

    // create customer
    const [
        handleCreateCustomer,
        {
            isLoading: isCreateCustomerLoading,
            isError: isCreateCustomerError,
            error: createCustomerError,
            data: createCustomerData,
        },
    ] = useCreateCustomerMutation();
    const createCustomer = ({
        formData,
        onSuccess,
    }: {
        formData: CustomerType;
        onSuccess?: CallableFunction;
    }) => {
        handleCreateCustomer(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Customer created successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed create customer",
                    status: "error",
                });
            }
        });
    };

    // update customer
    const [
        handleUpdateCustomer,
        {
            isLoading: isUpdateCustomerLoading,
            isError: isUpdateCustomerError,
            error: updateCustomerError,
            data: updateCustomerData,
        },
    ] = useUpdateCustomerMutation();
    const updateCustomer = ({
        formData,
        onSuccess,
    }: {
        formData: CustomerType;
        onSuccess?: CallableFunction;
    }) => {
        handleCreateCustomer(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Customer updated successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed update customer",
                    status: "error",
                });
            }
        });
    };
    return {
        customers,
        createCustomer: {
            submit: createCustomer,
            isLoading: isCreateCustomerLoading,
            isError: isCreateCustomerError,
            error: createCustomerError,
            data: createCustomerData,
        },
        updateCustomer: {
            submit: updateCustomer,
            isLoading: isUpdateCustomerLoading,
            isError: isUpdateCustomerError,
            error: updateCustomerError,
            data: updateCustomerData,
        },
    };
};
export default useCustomer;
