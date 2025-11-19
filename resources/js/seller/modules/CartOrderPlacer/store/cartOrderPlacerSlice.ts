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
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    
    // Calculate values for each product
    products.forEach(product => {
        const quantity = product.quantity || 1;
        const productSubtotal = product.price * quantity;
        
        // Add to subtotal
        subtotal += productSubtotal;
        
        // Calculate tax if product has tax data
        if (product.tax && product.tax > 0) {
            totalTax += (productSubtotal * product.tax) / 100;
        }
        
        // Calculate discount if product has discount
        if (product.discount_amount && product.discount_amount > 0) {
            if (product.discount_type === 'percentage') {
                totalDiscount += (productSubtotal * product.discount_amount) / 100;
            } else {
                // Flat discount
                totalDiscount += product.discount_amount * quantity;
            }
        }
    });
    
    const total = subtotal + totalTax - totalDiscount;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(totalTax.toFixed(2)),
        shipping: 0,
        discount: Number(totalDiscount.toFixed(2)),
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