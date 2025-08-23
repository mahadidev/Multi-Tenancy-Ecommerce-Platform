import useToast from "@seller/_hooks/useToast";
import { useAppDispatch, useAppSelector } from "@seller/store/store";
import {
    cartOrderPlacerApi,
    useAddToCartMutation,
    useCreateOrderMutation,
    useRemoveCartItemMutation,
    useUpdateCartMutation,
} from "../store/cartOrderPlacerApi";
import {
    addProduct,
    clearCustomer,
    clearSelectedProducts,
    removeProduct,
    resetOrderPlacer,
    setCustomer,
    setOrderReceipt,
    setProcessing,
    updateProductQuantity,
} from "../store/cartOrderPlacerSlice";
import {
    AddToCartPayloadType,
    CartIdType,
    CreateOrderPayloadType,
    FetchCartItemsPayloadType,
    OrderPlacerCustomer,
    OrderPlacerProduct,
    UpdateCartPayloadType,
} from "../types";

const useCartOrderPlacer = () => {
    const dispatch = useAppDispatch();
    const { toaster } = useToast();

    // Select state
    const {
        cartItems,
        customer,
        selectedProducts,
        orderSummary,
        isProcessing,
        orderReceipt,
    } = useAppSelector((state) => state.cartOrderPlacer);

    // Cart Operations
    // add item to cart
    const [
        handleAddToCart,
        {
            isLoading: isAddToCartLoading,
            isError: isAddToCartError,
            error: addToCartError,
            data: addToCartData,
        },
    ] = useAddToCartMutation();

    const addToCart = ({
        formData,
        onSuccess,
    }: {
        formData: AddToCartPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleAddToCart(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Item added to cart",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to add item to cart",
                    status: "error",
                });
            }
        });
    };

    // update cart
    const [
        handleUpdateCart,
        {
            isLoading: isUpdateCartLoading,
            isError: isUpdateCartError,
            error: updateCartError,
            data: updateCartData,
        },
    ] = useUpdateCartMutation();

    const updateCart = ({
        formData,
        onSuccess,
    }: {
        formData: UpdateCartPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateCart(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            } else {
                toaster({
                    text: "Failed to update cart",
                    status: "error",
                });
            }
        });
    };

    // remove cart item
    const [
        handleRemoveCartItem,
        {
            isLoading: isRemoveCartItemLoading,
            isError: isRemoveCartItemError,
            error: removeCartItemError,
            data: removeCartItemData,
        },
    ] = useRemoveCartItemMutation();

    const removeCartItem = ({
        formData,
        onSuccess,
    }: {
        formData: CartIdType;
        onSuccess?: CallableFunction;
    }) => {
        handleRemoveCartItem(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Item removed from cart",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to remove item from cart",
                    status: "error",
                });
            }
        });
    };

    // fetch cart items
    const [
        handleFetchCartItems,
        {
            isLoading: isFetchCartItemsLoading,
            isError: isFetchCartItemsError,
            error: fetchCartItemsError,
            data: fetchCartItemsData,
        },
    ] = cartOrderPlacerApi.endpoints.fetchCartItems.useLazyQuery();

    const fetchCartItems = ({
        formData,
        onSuccess,
    }: {
        formData: FetchCartItemsPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleFetchCartItems(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    // Order Placer Operations
    // create order
    const [
        handleCreateOrder,
        {
            isLoading: isCreateOrderLoading,
            isError: isCreateOrderError,
            error: createOrderError,
            data: createOrderData,
        },
    ] = useCreateOrderMutation();

    const createOrder = ({
        formData,
        onSuccess,
    }: {
        formData: CreateOrderPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        dispatch(setProcessing(true));
        handleCreateOrder(formData).then((response) => {
            dispatch(setProcessing(false));
            if (response.data?.status === 200) {
                dispatch(setOrderReceipt(response.data.data));
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Order created successfully",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to create order",
                    status: "error",
                });
            }
        });
    };

    // Customer management
    const setOrderCustomer = (customer: OrderPlacerCustomer) => {
        dispatch(setCustomer(customer));
    };

    const clearOrderCustomer = () => {
        dispatch(clearCustomer());
    };

    // Product management
    const addOrderProduct = (product: OrderPlacerProduct) => {
        dispatch(addProduct(product));
    };

    const removeOrderProduct = (productId: string) => {
        dispatch(removeProduct(productId));
    };

    const updateOrderProductQuantity = (productId: string, quantity: number) => {
        dispatch(updateProductQuantity({ productId, quantity }));
    };

    const clearOrderProducts = () => {
        dispatch(clearSelectedProducts());
    };

    // Reset entire order placer
    const resetOrder = () => {
        dispatch(resetOrderPlacer());
    };

    return {
        // Cart data
        cartItems,

        // Order placer data
        customer,
        selectedProducts,
        orderSummary,
        isProcessing,
        orderReceipt,

        // Cart operations
        addToCart: {
            submit: addToCart,
            isLoading: isAddToCartLoading,
            isError: isAddToCartError,
            error: addToCartError,
            data: addToCartData,
        },
        updateCart: {
            submit: updateCart,
            isLoading: isUpdateCartLoading,
            isError: isUpdateCartError,
            error: updateCartError,
            data: updateCartData,
        },
        removeCartItem: {
            submit: removeCartItem,
            isLoading: isRemoveCartItemLoading,
            isError: isRemoveCartItemError,
            error: removeCartItemError,
            data: removeCartItemData,
        },
        fetchCartItems: {
            submit: fetchCartItems,
            isLoading: isFetchCartItemsLoading,
            isError: isFetchCartItemsError,
            error: fetchCartItemsError,
            data: fetchCartItemsData,
        },

        // Order placer operations
        createOrder: {
            submit: createOrder,
            isLoading: isCreateOrderLoading,
            isError: isCreateOrderError,
            error: createOrderError,
            data: createOrderData,
        },

        // Order management functions
        setOrderCustomer,
        clearOrderCustomer,
        addOrderProduct,
        removeOrderProduct,
        updateOrderProductQuantity,
        clearOrderProducts,
        resetOrder,
    };
};

export default useCartOrderPlacer;
