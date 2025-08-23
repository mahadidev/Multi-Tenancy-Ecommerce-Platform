import {
    CreateProductPayloadType,
    DeleteProductPayloadType,
    FetchProductPayloadType,
    GenerateBarcodePayloadType,
    productApi,
    UpdateProductPayloadType,
    useCreateProductMutation,
    useDeleteProductMutation,
    useFetchProductsQuery,
    useFetchProductsSummaryQuery,
    useGenerateBarcodeMutation,
    useUpdateProductMutation,
} from '../store/productApi';
import { setProduct } from '../store/productSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { ProductVariantType } from '@type/productType';
// Helper function to check if array is empty or contains only blank/empty values
const isArrayEmptyOrBlank = (arr: any[]): boolean => {
    return !arr || arr.length === 0 || arr.every(item => !item || (typeof item === 'string' && item.trim() === ''));
};

const useProduct = ({
    summaryFilterRange,
    customDateRange,
}: {
    summaryFilterRange?: 'today' | 'week' | 'month' | 'year' | 'custom';
    customDateRange?: { startDate: string; endDate: string };
}) => {
    // fetch products
    useFetchProductsQuery();
    useFetchProductsSummaryQuery(
        { 
            range: summaryFilterRange ?? 'today',
            start_date: summaryFilterRange === 'custom' ? customDateRange?.startDate : undefined,
            end_date: summaryFilterRange === 'custom' ? customDateRange?.endDate : undefined,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    // select product
    const { products, meta, product, summary } = useAppSelector(
        (state) => state.product
    );

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
        handleCreate({
            ...formData,
            attachments: isArrayEmptyOrBlank(formData.attachments)
                ? formData.thumbnail
                    ? [formData.thumbnail]
                    : []
                : formData.attachments,
        }).then((response) => {
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
        formData = {
            ...formData,
            attachments: formData.attachments?.filter((a) => !a.includes('http'))
                .length
                ? formData.attachments.filter((a) => !a.includes('http'))
                : undefined,
        };
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
                (filterVariant: any) => filterVariant.label !== formData.label
            );

            const findVariant = product.variants?.find(
                (filterVariant: any) => filterVariant.label === formData.label
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

    // barcode generate
    const [
        handleGenerateBarcode,
        {
            isLoading: isBarCodeGenerateLoading,
            isError: isBarCodeGenerateError,
            error: barCodeGenerateError,
            data: barCodeGenerateData,
        },
    ] = useGenerateBarcodeMutation();
    const generateBarcode = ({
        formData,
        onSuccess,
    }: {
        formData: GenerateBarcodePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleGenerateBarcode(formData).then((response) => {
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
        summary,
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
        generateBarcode: {
            submit: generateBarcode,
            isLoading: isBarCodeGenerateLoading,
            isError: isBarCodeGenerateError,
            error: barCodeGenerateError,
            data: barCodeGenerateData,
        },
        fetchSummary: {},
    };
};
export default useProduct;