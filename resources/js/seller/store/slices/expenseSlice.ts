import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExpenseType } from "@type/expenseType";
import { MetaType } from "@type/tableType";

const initialState: {
    expenses: ExpenseType[];
    meta: MetaType | null;
} = {
    expenses: [],
    meta: null,
};

const expenseSlice = createSlice({
    name: "expense",
    initialState,
    reducers: {
        setExpenses: (state, action: PayloadAction<ExpenseType[]>) => {
            state.expenses = action.payload;
        },
        setMeta: (state, action: PayloadAction<MetaType>) => {
            state.meta = action.payload;
        },
        setTableExpenses: (
            state,
            action: PayloadAction<{
                expenses: ExpenseType[];
                meta: MetaType | null;
            }>
        ) => {
            state.expenses = action.payload.expenses;
            state.meta = action.payload.meta;
        },
        clearExpenses: (state) => {
            state.expenses = [];
            state.meta = null;
        },
    },
});

export const { 
    setExpenses, 
    setMeta, 
    setTableExpenses, 
    clearExpenses 
} = expenseSlice.actions;

export default expenseSlice.reducer;