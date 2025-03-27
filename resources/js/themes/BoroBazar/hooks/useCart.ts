// const BASE_URL = "https://ecommerce.test/api/v1";

import { useAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartAtom } from "../store/cart.atom";

const useCart = () => {
    const [cartItems, setCartItems] = useAtom(cartAtom);
    const [isLoading, setLoading] = useState(false);
    const [isPlacingOrder, setPlacingOrder] = useState(false);
    const [isLoadingCart, setLoadingCart] = useState(false);

    const navigate = useNavigate();
    const authToken = "2|0qN1KYrdyhhobPcO2qE3Y1GACDxd6e609R5Ih6RI4c7cabf4"; // Replace with actual token
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
        setLoadingCart(true);
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
            setLoadingCart(false);
            return data; // Optionally return the response data
        } catch (error) {
            console.error("Error adding item to cart:", error);
            setLoadingCart(false);
        }
    };

    const updateCartItem = async (cart_id: number, qty: number) => {
        setLoadingCart(true);
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
            setLoadingCart(false);
            return data; // Optionally return the response data
        } catch (error) {
            setLoadingCart(false);
            console.error("Error adding item to cart:", error);
        }
    };

    const deleteCartItem = async (cart_id: number) => {
        setLoadingCart(true);
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
            setLoadingCart(false);
        } catch (error) {
            setLoadingCart(false);
            console.error("Error deleting item to cart:", error);
        }
    };

    const placeOrder = async (payload: PlaceOrderPayloadType) => {
        setPlacingOrder(true);
        try {
            const response = await fetch(`${BASE_URL}/place-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`, // ✅ Token added here
                },
                body: JSON.stringify({ ...payload, session_store_id: 1 }),
            });

            if (response.ok) {
                fetchCartItems();
                navigate("/order-success");
            }

            const data = await response.json();
            setPlacingOrder(false);

            return data; // Optionally return the response data
        } catch (error) {
            setPlacingOrder(false);
            console.error("Error placing order:", error);
        }
    };

    return {
        fetchCartItems,
        isLoading,
        cartItems,
        addToCart,
        deleteCartItem,
        updateCartItem,
        placeOrder,
        isPlacingOrder,
        isLoadingCart,
    };
};
export default useCart;

export interface PlaceOrderPayloadType {
    name: string;
    email: string;
    phone: string;
    address: string;
    payment_method: string; // Limited to these values
    notes?: string; // Nullable field
}
