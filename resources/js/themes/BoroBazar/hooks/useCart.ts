// const BASE_URL = "https://ecommerce.test/api/v1";

import { useAtom } from "jotai";
import { useState } from "react";
import { cartAtom } from "../store/cart.atom";

const useCart = () => {
    const [cartItems, setCartItems] = useAtom(cartAtom);
    const [isLoading, setLoading] = useState(false);

    const authToken = "2|ydHfKP5ghI1VmcvIoaVvUM5a7XSugej0Ml86NSks5af1ece8"; // Replace with actual token
    const BASE_URL = "http://127.0.0.1:8000/api/v1";

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/cart-items`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // ✅ Added token here
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setCartItems(data?.data?.cart_items);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching cart items:", error);
        }
    };

    const addToCart = async (product_id: number, qty: string) => {
        try {
            const response = await fetch(`${BASE_URL}/add-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // ✅ Token added here
                },
                body: JSON.stringify({
                    product_id,
                    qty,
                    session_store_id: 1,
                }),
            });

            if (response.ok) {
                fetchCartItems();
            }

            const data = await response.json();
            console.log("Item added to cart:", data);
            return data; // Optionally return the response data
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const updateCartItem = async (cart_id: number, qty: number) => {
        try {
            const response = await fetch(`${BASE_URL}/cart-items/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // ✅ Token added here
                },
                body: JSON.stringify({
                    cart_id,
                    qty,
                    session_store_id: 1,
                }),
            });

            if (response.ok) {
                fetchCartItems();
            }

            const data = await response.json();
            console.log("Item added to cart:", data);
            return data; // Optionally return the response data
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const deleteCartItem = async (cart_id: number) => {
        try {
            const response = await fetch(`${BASE_URL}/cart-items/delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // ✅ Token added here
                },
                body: JSON.stringify({
                    cart_id,
                }),
            });

            if (response.ok) {
                fetchCartItems();
            }
        } catch (error) {
            console.error("Error deleting item to cart:", error);
        }
    };

    return {
        fetchCartItems,
        isLoading,
        cartItems,
        addToCart,
        deleteCartItem,
        updateCartItem,
    };
};
export default useCart;
