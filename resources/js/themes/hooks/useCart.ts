import { useAppSelector } from '@themes/store/store';

const useCart = () => {
	const { cartItems } = useAppSelector((state) => state.cart);

	const onAddCart = (cartItem: {
		userId: number;
		productId: number;
		qty: number;
	}) => {

	};

	return {
		cartItems,
	};
};

export default useCart;
