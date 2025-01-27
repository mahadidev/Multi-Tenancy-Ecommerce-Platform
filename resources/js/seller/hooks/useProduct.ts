import { CreateProductPayloadType, DeleteProductPayloadType, FetchProductPayloadType, productApi, UpdateProductPayloadType, useCreateProductMutation, useDeleteProductMutation, useFetchProductQuery, useFetchProductsQuery, useUpdateProductMutation } from '@seller/store/reducers/productApi';
import { useAppSelector } from '@seller/store/store';

const useProduct = () => {
	// fetch products
	useFetchProductsQuery();


	// select product
	const { products, meta, product } = useAppSelector((state) => state.product);

	// create product
	const [
		handleCreate,
		{
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
		},
	] = useCreateProductMutation();
	const create = ({
		formData,
		onSuccess,
	}: {
		formData: CreateProductPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleCreate(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	// update product
	const [
		handleUpdate,
		{
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			error: updateError,
			data: updateData,
		},
	] = useUpdateProductMutation();
	const update = ({
		formData,
		onSuccess,
	}: {
		formData: UpdateProductPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleUpdate(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	// delete product
	const [
		handleDelete,
		{
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
		},
	] = useDeleteProductMutation();
	const deleteProduct = ({
		formData,
		onSuccess,
	}: {
		formData: DeleteProductPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleDelete(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	// fetchProduct 
	const [
			handleFetchProduct,
			{
				isLoading: isFetchProductLoading,
				isError: isFetchProductError,
				error: fetchProductError,
				data: fetchProductData,
			},
		] = productApi.endpoints.fetchProduct.useLazyQuery();
		const fetchProduct= ({
			formData,
			onSuccess,
		}: {
			formData: FetchProductPayloadType;
			onSuccess?: CallableFunction;
		}) => {
			handleFetchProduct(formData).then((response) => {
				if (response.data?.status === 200) {
					if (onSuccess) {
						onSuccess(response.data.data);
					}
				}
			});
		};
	

	return {
		products,
		product,
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
			submit: deleteProduct,
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
		},
		fetchProduct: {
			submit: fetchProduct,
			isLoading: isFetchProductLoading,
			isError: isFetchProductError,
			error: fetchProductError,
			data: fetchProductData,
		}
	};
};
export default useProduct;
