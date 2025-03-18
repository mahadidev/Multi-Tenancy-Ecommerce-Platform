// const BASE_URL = "https://ecommerce.test/api/v1";

import { useState } from "react";

export interface CartItemType {
    id: number;
    item: string;
    qty: number;
    price: number;
    total: number;
    product: CartProductType;
}

export interface CartProductType {
    id: number;
    name: string;
    price: string;
    image: string;
}

const useCart = () => {
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);

    const fetchCartItems = async () => {
        try {
            const authToken =
                "4|7MeLXGFJmyJsWcPtt6pIiepqSrBYdEeH6tWbH5o9c2c8061f"; // Replace with actual token

            const response = await fetch(
                `https://ecommerce.test/api/v1/cart-items`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`, // ✅ Added token here
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setCartItems(data?.data?.cart_items);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const addToCart = async (product_id: number, qty: string) => {
        try {
            const authToken =
                "4|7MeLXGFJmyJsWcPtt6pIiepqSrBYdEeH6tWbH5o9c2c8061f"; // Replace with actual token

            const response = await fetch(
                `https://ecommerce.test/api/v1/add-to-cart`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`, // ✅ Token added here
                    },
                    body: JSON.stringify({
                        product_id,
                        qty,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Item added to cart:", data);
            return data; // Optionally return the response data
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    return { fetchCartItems, cartItems, addToCart };
};
export default useCart;
