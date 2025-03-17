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
                "21|3s4Drow5X73hVHkP2pKOnAgP95jclZOvwqV6dJ5Y3974cd32"; // Replace with actual token

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

    return { fetchCartItems, cartItems };
};
export default useCart;
