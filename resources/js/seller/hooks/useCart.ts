import {
    AddToCartPayloadType,
    cartApi,
    FetchCartItemsPayloadType,
    UpdateCartPayloadType,
    useAddToCartMutation,
    useUpdateCartMutation,
} from "@seller/store/reducers/cartApi";
import { useAppSelector } from "@seller/store/store";
import useToast from "./useToast";

const useCart = () => {
    // toast hook
    const { toaster } = useToast();

    // select cart items
    const { cartItems } = useAppSelector((state) => state.cart);

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
            } else {
                toaster({
                    text: "Failed add to item",
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
                    text: "Failed update cart",
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
    ] = cartApi.endpoints.fetchCartItems.useLazyQuery();
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

    return {
        cartItems,
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

        fetchCartItems: {
            submit: fetchCartItems,
            isLoading: isFetchCartItemsLoading,
            isError: isFetchCartItemsError,
            error: fetchCartItemsError,
            data: fetchCartItemsData,
        },
    };
};
export default useCart;
