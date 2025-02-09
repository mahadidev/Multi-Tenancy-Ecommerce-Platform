import { useFetchCustomersQuery } from "@seller/store/reducers/customerApi";
import { useAppSelector } from "@seller/store/store";

const useCustomer = () => {
    // fetch customers
    useFetchCustomersQuery();

    // select customers
    const { customers } = useAppSelector((state) => state.customer);

    return {
        customers,
    };
};
export default useCustomer;
