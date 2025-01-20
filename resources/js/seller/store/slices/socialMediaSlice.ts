import { MetaType, SocialMediaType } from "@/seller/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    socialMedias: SocialMediaType[];
    socialMediasType: MetaType | null | undefined;
} = {
    socialMedias: [],
    socialMediasType: null,
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
            state.socialMediasType = action.payload;
        },
    },
});
export const { setSocialMedias, setSocialMediasMeta } =
    socialMediaSlice.actions;
export default socialMediaSlice.reducer;
