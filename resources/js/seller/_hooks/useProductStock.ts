import {
    CreateProductStockPayloadType,
    DeleteProductStockPayloadType,
    UpdateProductStockPayloadType,
    useCreateProductStockMutation,
    useDeleteProductStockMutation,
    useFetchProductStocksQuery,
    useUpdateProductStockMutation,
} from '@seller/store/reducers/productStockApi';

import { useAppSelector } from '@seller/store/store';

const useProductStock = (id: number | string, options: { fetchData?: boolean } = { fetchData: true }) => {
	// Only fetch if explicitly requested to avoid multiple calls from modals
	const { data: stocksData, isLoading: isFetching, error: fetchError } = useFetchProductStocksQuery(
		{ productId: id },
		{
			// Skip if id is falsy or fetchData is false
			skip: !id || !options.fetchData,
			// Only refetch when mounting if data is stale
			refetchOnMountOrArgChange: false,
			// Don't refetch on focus or reconnect to reduce calls
			refetchOnFocus: false,
			refetchOnReconnect: false,
		}
	);

	// Get stocks directly from RTK Query cache
	const productStocks = stocksData?.data?.stocks || [];
	
	// select product stock from slice (for individual stock selection)
	const { selectedStock } = useAppSelector(
		(state) => state.productStock
	);

	// create stock
	const [
		handleCreate,
		{
			isLoading: isCreateLoading,
			isError: isCreateError,
			isSuccess: isCreateSuccess,
			error: createError,
			data: createData,
		},
	] = useCreateProductStockMutation();

	const create = ({
		formData,
		onSuccess,
	}: {
		formData: CreateProductStockPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleCreate({ ...formData }).then((response) => {
			if (response.data?.status === 200 && onSuccess) {
				onSuccess(response.data.data);
			}
		});
	};

	// update stock
	const [
		handleUpdate,
		{
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			isSuccess: isUpdateSuccess,
			error: updateError,
			data: updateData,
		},
	] = useUpdateProductStockMutation();

	const update = ({
		formData,
		onSuccess,
	}: {
		formData: UpdateProductStockPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleUpdate({ ...formData }).then((response) => {
			if (response.data?.status === 200 && onSuccess) {
				onSuccess(response.data.data);
			}
		});
	};

	// delete stock
	const [
		handleDelete,
		{
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			isSuccess: isDeleteSuccess,
			error: deleteError,
			data: deleteData,
		},
	] = useDeleteProductStockMutation();

	const deleteStock = ({
		formData,
		onSuccess,
	}: {
		formData: DeleteProductStockPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleDelete({ ...formData }).then((response) => {
			if (response.data?.status === 200 && onSuccess) {
				onSuccess(response.data.data);
			}
		});
	};

	return {
		productStocks,
		productStock: selectedStock,
		isFetching,
		fetchError,
		create: {
			submit: create,
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
			isSuccess: isCreateSuccess,
		},
		update: {
			submit: update,
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			error: updateError,
			data: updateData,
			isSuccess: isUpdateSuccess,
		},
		delete: {
			submit: deleteStock,
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
			isSuccess: isDeleteSuccess,
		},
	};
};

export default useProductStock;
