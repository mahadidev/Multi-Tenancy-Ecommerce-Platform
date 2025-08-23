import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    CartItemType,
    CartState,
    OrderPlacerState,
    OrderPlacerCustomer,
    OrderPlacerProduct,
    OrderReceiptType,
} from "../types";

export interface CombinedState extends CartState, OrderPlacerState {
    orderReceipt: OrderReceiptType | null;
}

const initialState: CombinedState = {
    // Cart state
    cartItems: [],
    
    // Order placer state
    customer: null,
    selectedProducts: [],
    orderSummary: {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0,
    },
    isProcessing: false,
    orderReceipt: null,
};

const cartOrderPlacerSlice = createSlice({
    name: "cartOrderPlacer",
    initialState,
    reducers: {
        // Cart reducers
        setCartItems: (state, action: PayloadAction<CartItemType[]>) => {
            state.cartItems = action.payload;
        },
        clearCartItems: (state) => {
            state.cartItems = [];
        },

        // Order placer reducers
        setCustomer: (state, action: PayloadAction<OrderPlacerCustomer>) => {
            state.customer = action.payload;
        },
        clearCustomer: (state) => {
            state.customer = null;
        },

        addProduct: (state, action: PayloadAction<OrderPlacerProduct>) => {
            const existingProduct = state.selectedProducts.find(
                (p) => p.id === action.payload.id
            );
            if (existingProduct) {
                existingProduct.quantity = (existingProduct.quantity || 1) + 1;
            } else {
                state.selectedProducts.push({
                    ...action.payload,
                    quantity: 1,
                });
            }
            // Recalculate order summary
            state.orderSummary = calculateOrderSummary(state.selectedProducts);
        },

        removeProduct: (state, action: PayloadAction<string>) => {
            state.selectedProducts = state.selectedProducts.filter(
                (p) => p.id !== action.payload
            );
            // Recalculate order summary
            state.orderSummary = calculateOrderSummary(state.selectedProducts);
        },

        updateProductQuantity: (
            state,
            action: PayloadAction<{ productId: string; quantity: number }>
        ) => {
            const product = state.selectedProducts.find(
                (p) => p.id === action.payload.productId
            );
            if (product) {
                product.quantity = action.payload.quantity;
            }
            // Recalculate order summary
            state.orderSummary = calculateOrderSummary(state.selectedProducts);
        },

        setSelectedProducts: (state, action: PayloadAction<OrderPlacerProduct[]>) => {
            state.selectedProducts = action.payload;
            // Recalculate order summary
            state.orderSummary = calculateOrderSummary(state.selectedProducts);
        },

        clearSelectedProducts: (state) => {
            state.selectedProducts = [];
            state.orderSummary = {
                subtotal: 0,
                tax: 0,
                shipping: 0,
                discount: 0,
                total: 0,
            };
        },

        updateOrderSummary: (
            state,
            action: PayloadAction<Partial<CombinedState["orderSummary"]>>
        ) => {
            state.orderSummary = { ...state.orderSummary, ...action.payload };
        },

        setProcessing: (state, action: PayloadAction<boolean>) => {
            state.isProcessing = action.payload;
        },

        setOrderReceipt: (state, action: PayloadAction<OrderReceiptType>) => {
            state.orderReceipt = action.payload;
        },

        clearOrderReceipt: (state) => {
            state.orderReceipt = null;
        },

        resetOrderPlacer: (state) => {
            state.customer = null;
            state.selectedProducts = [];
            state.orderSummary = {
                subtotal: 0,
                tax: 0,
                shipping: 0,
                discount: 0,
                total: 0,
            };
            state.isProcessing = false;
            state.orderReceipt = null;
        },
    },
});

// Helper function to calculate order summary
const calculateOrderSummary = (products: OrderPlacerProduct[]) => {
    const subtotal = products.reduce(
        (sum, product) => sum + (product.price * (product.quantity || 1)),
        0
    );
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 5; // Free shipping over $50
    const discount = 0; // Could be calculated based on promotions
    const total = subtotal + tax + shipping - discount;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        total: Number(total.toFixed(2)),
    };
};

export const {
    // Cart actions
    setCartItems,
    clearCartItems,
    
    // Order placer actions
    setCustomer,
    clearCustomer,
    addProduct,
    removeProduct,
    updateProductQuantity,
    setSelectedProducts,
    clearSelectedProducts,
    updateOrderSummary,
    setProcessing,
    setOrderReceipt,
    clearOrderReceipt,
    resetOrderPlacer,
} = cartOrderPlacerSlice.actions;

export default cartOrderPlacerSlice.reducer;