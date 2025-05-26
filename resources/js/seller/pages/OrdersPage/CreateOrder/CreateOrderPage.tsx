import { useEffect, useState } from "react";

import useCart from "@seller/hooks/useCart";


export default function CreateOrderPage() {
    const [selectedCustomer] = useState<number | null>(
        null
    );

    const { fetchCartItems } =
        useCart();

    useEffect(() => {
        if (selectedCustomer !== null) {
            fetchCartItems.submit({ formData: { id: selectedCustomer } });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCustomer]);

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
