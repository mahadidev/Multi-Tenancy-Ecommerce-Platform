import { useFetchOrdersQuery } from "@seller/store/reducers/orderApi";
import { useAppSelector } from "../store/store";

const useOrders = () => {
    // const { toaster } = useToast(); // for showing toast messages

    useFetchOrdersQuery(); // orders query

    // select orders
    const { orders, order } = useAppSelector((state) => state.order);
    // update order status
    // const [
    //     handleUpdateOrder,
    //     {
    //         isLoading: isUpdateLoading,
    //         isError: isUpdateError,
    //         error: updateError,
    //         data: updateData,
    //     },
    // ] = useUpdateUserMutation();
    // const update = ({
    //     formData,
    //     onSuccess,
    // }: {
    //     formData: UserProfileType;
    //     onSuccess?: CallableFunction;
    // }) => {
    //     handleUpdateUser(formData).then((response) => {
    //         if (response.data?.status === 200) {
    //             if (onSuccess) {
    //                 onSuccess(response.data.data);
    //             }
    //         }
    //     });
    // };

    // return from here
    return {
        orders,
        order,
    };
};

export default useOrders;
