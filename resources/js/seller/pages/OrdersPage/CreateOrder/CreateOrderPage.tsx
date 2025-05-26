import { Button } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useCart from "@seller/hooks/useCart";
import useCustomer from "@seller/hooks/useCustomer";
import useNotification from "@seller/hooks/useNotification";
import useOrders from "@seller/hooks/useOrders";
import useProduct from "@seller/hooks/useProduct";
import { CustomerType } from "@type/customersType";
import { CartSummaryCard } from "./CartSummaryCard";
import { CustomerSelector } from "./CustomerSelector";
import { ProductSelector } from "./ProductSelector";

export default function CreateOrderPage() {
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(
        null
    );
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    const navigate = useNavigate();
    const { reFetchNotifications } = useNotification();
    const { products } = useProduct();
    const { customers } = useCustomer();
    const { placeOrder } = useOrders();
    const { cartItems, fetchCartItems, addToCart, updateCart, removeCartItem } =
        useCart();

    useEffect(() => {
        if (selectedCustomer !== null) {
            fetchCartItems.submit({ formData: { id: selectedCustomer } });
        }
    }, [selectedCustomer]);

    const totalAmount = useMemo(
        () =>
            cartItems?.reduce((sum, item) => sum + item.qty * item.price, 0) ||
            0,
        [cartItems]
    );

    const handleAddToCart = () => {
        if (selectedCustomer && selectedProduct) {
            addToCart.submit({
                formData: {
                    product_id: selectedProduct,
                    qty: 1,
                    user_id: selectedCustomer,
                },
            });
        }
    };

    const handlePlaceOrder = () => {
        if (selectedCustomer) {
            placeOrder.submit({
                formData: {
                    ...getOrderCustomerDetails(customers, selectedCustomer),
                    payment_method: paymentMethod,
                },
                onSuccess: () => {
                    reFetchNotifications.submit();
                    navigate("/orders");
                },
            });
        }
    };

    return (
			<div className="p-6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
				{/* <div className="grid md:grid-cols-3 gap-5 my-4">
					<CustomerSelector
						customers={customers}
						selected={selectedCustomer}
						setSelected={setSelectedCustomer}
					/>
					<ProductSelector
						products={products}
						selected={selectedProduct}
						setSelected={setSelectedProduct}
					/>
					<div className="flex flex-col justify-end gap-2">
						<Button
							color="primary"
							disabled={!selectedCustomer || !selectedProduct}
							onClick={handleAddToCart}
							isProcessing={addToCart.isLoading}
						>
							Add to Cart
						</Button>
					</div>


				</div>

				{/* <CartSummaryCard
					cartItems={cartItems}
					totalAmount={totalAmount}
					updateCart={updateCart}
					removeCartItem={removeCartItem}
					paymentMethod={paymentMethod}
					setPaymentMethod={setPaymentMethod}
					handlePlaceOrder={handlePlaceOrder}
					isLoading={placeOrder.isLoading}
				/> */}

			</div>
		);
}

const getOrderCustomerDetails = (
    customers: CustomerType[],
    customerId: number
) => {
    const customer = customers?.find(
        (customer: CustomerType) => customer?.id === customerId
    );

    return {
        name: customer?.name ?? "",
        phone: customer?.phone || "017*******",
        email: customer?.email ?? "",
        address: customer?.address || "N/A",
        user_id: customerId,
    };
};
