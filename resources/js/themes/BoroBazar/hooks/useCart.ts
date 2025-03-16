const BASE_URL = "http://127.0.0.1:8000/api/v1";

const useCart = () => {
    const fetchCartItems = async () => {
        try {
            const authToken =
                "2|3fFVuYCNYyBxH0P4j8HmJKHho4TqP2GvVgUvTIYx889d94f1"; // Replace with actual token

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
            console.log({ fetchItems: data });
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    return { fetchCartItems, cartItems: [] };
};
export default useCart;
