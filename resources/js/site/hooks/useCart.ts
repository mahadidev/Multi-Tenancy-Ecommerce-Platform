import { useFetchCartQuery } from "@site/store/reducers/cartApi";
import { useAppSelector } from "@site/store/store";

const useCart = () => {
    useFetchCartQuery();
    const { items, qty, price} = useAppSelector((state) => state.cart);

    return {items, qty, price}
}
export default useCart
