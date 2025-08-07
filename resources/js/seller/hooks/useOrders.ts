import {
    BulkShipmentOrderPayloadType,
    orderApi,
    PlaceOrderNonUserPayloadType,
    PlaceOrderPayloadType,
    useBulkShipmentOrdersMutation,
    useFetchOrderReportQuery,
    useFetchOrdersQuery,
    useFetchShipmentOrdersQuery,
    usePlaceOrderMutation,
    usePlaceOrderNonUserMutation,
    useUpdateOrderStatusMutation,
} from "@seller/store/reducers/orderApi";
import { OrderType } from "@type/orderType";
import { useAppSelector } from "../store/store";
import useToast from "./useToast";

const useOrders = ({
	reportFilterRange,
}: {
	reportFilterRange?: 'today' | 'week' | 'month' | 'year' | undefined;
}) => {
	const { toaster } = useToast(); // for showing toast messages

	useFetchOrdersQuery(); // orders query
	useFetchShipmentOrdersQuery(); // shipment orders query
	useFetchOrderReportQuery(
		{
			range: reportFilterRange ?? 'week',
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	// select orders
	const { orders, order, shipmentOrders, report } = useAppSelector(
		(state) => state.order
	);

	// update order status
	const [
		handleBulkShipmentOrders,
		{
			isLoading: isBulkShipmentOrdersLoading,
			isError: isBulkShipmentOrdersError,
			error: bulkShipmentOrdersError,
			data: bulkShipmentOrdersData,
		},
	] = useBulkShipmentOrdersMutation();
	const bulkShipmentOrders = ({
		formData,
		onSuccess,
	}: {
		formData: BulkShipmentOrderPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleBulkShipmentOrders(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

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

	// place order
	const [
		handlePlaceOrder,
		{
			isLoading: isPlaceOrderLoading,
			isError: isPlaceOrderError,
			error: placeOrderError,
			data: placeOrderData,
		},
	] = usePlaceOrderMutation();
	const placeOrder = ({
		formData,
		onSuccess,
	}: {
		formData: PlaceOrderPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handlePlaceOrder(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
				toaster({
					text: 'Order placed successfully',
					status: 'success',
				});
			} else {
				toaster({
					text: 'Failed to place order',
					status: 'error',
				});
			}
		});
	};

	// place order non user
	const [
		handlePlaceOrderNonUser,
		{
			isLoading: isPlaceOrderNonUserLoading,
			isError: isPlaceOrderNonUserError,
			error: placeOrderNonUserError,
			data: placeOrderNonUserData,
			isSuccess: isPlaceOrderNonUserSuccess,
			reset: placeOrderNonuserReset,
		},
	] = usePlaceOrderNonUserMutation();
	const placeOrderNonUser = ({
		formData,
		onSuccess,
	}: {
		formData: PlaceOrderNonUserPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handlePlaceOrderNonUser(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
				toaster({
					text: 'Order placed successfully',
					status: 'success',
				});
			} else {
				toaster({
					text:
						placeOrderNonUserError && 'message' in placeOrderNonUserError
							? placeOrderNonUserError.message || 'Something went wrong'
							: 'Something went wrong',
					status: 'error',
				});
			}
		});
	};

	// fetch sync shipment orders
	const [
		handleSyncShipmentOrders,
		{
			isLoading: isSyncShipmentOrdersLoading,
			isError: isSyncShipmentOrders,
			error: syncShipmentOrdersError,
			data: syncShipmentOrdersData,
		},
	] = orderApi.endpoints.syncShipmentOrders.useLazyQuery();
	const syncShipmentOrders = ({
		formData,
		onSuccess,
	}: {
		formData: any;
		onSuccess?: CallableFunction;
	}) => {
		handleSyncShipmentOrders(formData).then((response) => {
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
		shipmentOrders,
		order,
		report,
		updateOrderStatus: {
			submit: updateOrderStatus,
			isLoading: isUpdateOrderStatusLoading,
			isError: isUpdateOrderStatusError,
			error: updateOrderStatusError,
			data: updateOrderStatusData,
		},
		placeOrder: {
			submit: placeOrder,
			isLoading: isPlaceOrderLoading,
			isError: isPlaceOrderError,
			error: placeOrderError,
			data: placeOrderData,
		},
		placeOrderNonUser: {
			submit: placeOrderNonUser,
			isLoading: isPlaceOrderNonUserLoading,
			isError: isPlaceOrderNonUserError,
			error: placeOrderNonUserError,
			data: placeOrderNonUserData,
			isSuccess: isPlaceOrderNonUserSuccess,
			reset: placeOrderNonuserReset,
		},
		bulkShipmentOrders: {
			submit: bulkShipmentOrders,
			isLoading: isBulkShipmentOrdersLoading,
			isError: isBulkShipmentOrdersError,
			error: bulkShipmentOrdersError,
			data: bulkShipmentOrdersData,
		},
		syncShipmentOrders: {
			submit: syncShipmentOrders,
			isLoading: isSyncShipmentOrdersLoading,
			isError: isSyncShipmentOrders,
			error: syncShipmentOrdersError,
			data: syncShipmentOrdersData,
		},
	};
};

export default useOrders;
