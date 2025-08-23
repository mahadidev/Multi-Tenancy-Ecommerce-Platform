import {
    CreateExpensePayloadType,
    DeleteExpensePayloadType,
    UpdateExpensePayloadType,
    useCreateExpenseMutation,
    useDeleteExpenseMutation,
    useFetchExpensesQuery,
    useUpdateExpenseMutation,
} from "@seller/store/reducers/expenseApi";
import { useAppSelector } from "@seller/store/store";
import useToast from "./useToast";

const useExpense = () => {
    // fetch expenses
    useFetchExpensesQuery();

    // toast hook
    const { toaster } = useToast();

    // select expense state
    const { expenses, meta } = useAppSelector((state) => state.expense);

    // create expense
    const [
        handleCreate,
        {
            isLoading: isCreateLoading,
            isError: isCreateError,
            error: createError,
            data: createData,
        },
    ] = useCreateExpenseMutation();

    const create = ({
        formData,
        onSuccess,
    }: {
        formData: CreateExpensePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleCreate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                toaster({
                    text: "Expense created successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to create expense",
                    status: "error",
                });
            }
        });
    };

    // update expense
    const [
        handleUpdate,
        {
            isLoading: isUpdateLoading,
            isError: isUpdateError,
            error: updateError,
            data: updateData,
        },
    ] = useUpdateExpenseMutation();

    const update = ({
        formData,
        onSuccess,
    }: {
        formData: UpdateExpensePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Expense updated successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to update expense",
                    status: "error",
                });
            }
        });
    };

    // delete expense
    const [
        handleDelete,
        {
            isLoading: isDeleteLoading,
            isError: isDeleteError,
            error: deleteError,
            data: deleteData,
        },
    ] = useDeleteExpenseMutation();

    const deleteExpense = ({
        formData,
        onSuccess,
    }: {
        formData: DeleteExpensePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleDelete(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Expense deleted successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to delete expense",
                    status: "error",
                });
            }
        });
    };

    return {
        expenses,
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
            submit: deleteExpense,
            isLoading: isDeleteLoading,
            isError: isDeleteError,
            error: deleteError,
            data: deleteData,
        },
    };
};

export default useExpense;
