import {
    CreateProductPayloadType,
    DeleteProductPayloadType,
    FetchProductPayloadType,
    productApi,
    UpdateProductPayloadType,
    useCreateProductMutation,
    useDeleteProductMutation,
    useFetchProductsQuery,
    useUpdateProductMutation,
} from '@seller/store/reducers/productApi';
import { setProduct } from '@seller/store/slices/productSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { ProductVariantType } from '@type/productType';

const useProduct = () => {
	// fetch products
	useFetchProductsQuery();

	// select product
	const { products, meta, product } = useAppSelector((state) => state.product);

	// dispatch
	const dispatch = useAppDispatch();

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
	const fetchProduct = ({
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

	// add variant
	const addVariant = ({
		formData,
		onSuccess,
	}: {
		formData: ProductVariantType;
		onSuccess?: CallableFunction;
	}) => {
		if (product) {
			// if variant already exist
			const filteredVariants = product.variants?.filter(
				(filterVariant) => filterVariant.label !== formData.label
			);

			const findVariant = product.variants?.find(
				(filterVariant) => filterVariant.label === formData.label
			);

			if (filteredVariants && findVariant) {
				dispatch(
					setProduct({
						...product,
						variants: [
							...filteredVariants,
							{
								...findVariant,
								options: [...findVariant.options, ...formData.options],
							},
						],
					})
				);
			} else {
				dispatch(
					setProduct({
						...product,
						variants: [...(filteredVariants ?? []), formData],
					})
				);
			}

			if (onSuccess) {
				onSuccess();
			}
		}
	};

	// remove variant
	const removeVariant = ({
		formData,
		onSuccess,
	}: {
		formData: ProductVariantType;
		onSuccess?: CallableFunction;
	}) => {
		if (product) {
			// if variant already exist
			const filteredVariants = product.variants?.filter(
				(filterVariant) => filterVariant.label !== formData.label
			);

			if (filteredVariants) {
				dispatch(
					setProduct({
						...product,
						variants: [...filteredVariants],
					})
				);
			}

			if (onSuccess) {
				onSuccess();
			}
		}
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
		},
		addVariant: {
			submit: addVariant,
		},
		removeVariant: {
			submit: removeVariant,
		},
	};
};
export default useProduct;
