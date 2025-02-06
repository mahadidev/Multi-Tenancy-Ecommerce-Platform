import {
    useFetchOrdersQuery,
    useUpdateOrderStatusMutation,
} from "@seller/store/reducers/orderApi";
import { OrderType } from "@type/orderType";
import { useAppSelector } from "../store/store";

const useOrders = () => {
    // const { toaster } = useToast(); // for showing toast messages

    useFetchOrdersQuery(); // orders query

    // select orders
    const { orders, order } = useAppSelector((state) => state.order);

    // update order status
    const [
        handleUpdateOrderStatus,
        {
            isLoading: isUpdateOrderStatusLoading,
            isError: isUpdateOrderStatusError,
            error: updateOrderStatusError,
            data: updateOrderStatusData,
        },
    ] = useUpdateOrderStatusMutation();
    const updateOrderStatus = ({
        formData,
        onSuccess,
    }: {
        formData: OrderType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateOrderStatus(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    // return from here
    return {
        orders,
        order,
        updateOrderStatus: {
            submit: updateOrderStatus,
            isLoading: isUpdateOrderStatusLoading,
            isError: isUpdateOrderStatusError,
            error: updateOrderStatusError,
            data: updateOrderStatusData,
        },
    };
};

export default useOrders;
