import { useAppSelector } from "@themes/store/store";

const useCart = () => {
    // @ts-ignore
    const { cartItems } = useAppSelector((state) => state.cart);

    const onAddCart = (cartItem: {
        userId: number;
        productId: number;
        qty: number;
    }) => {
        console.log({ cartItem });
    };
    console.log({ onAddCart });
    return {
        cartItems,
    };
};

export default useCart;
