import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocialMediaListType, SocialMediaType } from '@type/socialMediaType';
import { MetaType } from '@type/tableType';
import { socialMediaListData } from '../../data/socialMedia';

const initialState: {
	socialMediaList: SocialMediaListType[];
	socialMedias: SocialMediaType[];
	meta: MetaType | null;
} = {
    socialMediaList: socialMediaListData,
	socialMedias: [],
	meta: null,
};

const socialMediaSlice = createSlice({
	name: 'socialMedia',
	initialState,
	reducers: {
		setSocialMedias: (state, action: PayloadAction<SocialMediaType[]>) => {
			state.socialMedias = action.payload;
		},
		setMeta: (state, action: PayloadAction<MetaType>) => {
			state.meta = action.payload;
		},
		setTableSocialMedias: (
			state,
			action: PayloadAction<{
				socialMedias: SocialMediaType[];
				meta: MetaType | null;
			}>
		) => {
			state.socialMedias = action.payload.socialMedias;
			state.meta = action.payload.meta;
		},
		clearSocialMedias: (state) => {
			state.socialMedias = [];
			state.meta = null;
		},
	},
});
export const { setSocialMedias, setMeta, setTableSocialMedias, clearSocialMedias } =
	socialMediaSlice.actions;
export default socialMediaSlice.reducer;
