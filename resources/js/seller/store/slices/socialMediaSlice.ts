import { MetaType, SocialMediaType } from "@/seller/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    socialMedias: SocialMediaType[];
    socialMediasMeta: MetaType | null | undefined;
} = {
    socialMedias: [],
    socialMediasMeta: null,
};
const socialMediaSlice = createSlice({
    name: "socialMedia",
    initialState,
    reducers: {
        setSocialMedias: (state, action: PayloadAction<SocialMediaType[]>) => {
            state.socialMedias = action.payload;
        },
        setSocialMediasMeta: (
            state,
            action: PayloadAction<MetaType | undefined>
        ) => {
            state.socialMediasMeta = action.payload;
        },
    },
});
export const { setSocialMedias, setSocialMediasMeta } =
    socialMediaSlice.actions;
export default socialMediaSlice.reducer;
