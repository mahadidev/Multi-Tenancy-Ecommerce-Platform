import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SocialMedia, SocialMediaList } from '../types';

export interface SocialMediaState {
  socialMedias: SocialMedia[];
  selectedSocialMedia: SocialMedia | null;
  socialMediaList: SocialMediaList[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

const initialState: SocialMediaState = {
  socialMedias: [],
  selectedSocialMedia: null,
  socialMediaList: [
    { name: 'facebook', label: 'Facebook', url: 'https://facebook.com/', icon: 'fab fa-facebook' },
    { name: 'twitter', label: 'Twitter', url: 'https://twitter.com/', icon: 'fab fa-twitter' },
    { name: 'instagram', label: 'Instagram', url: 'https://instagram.com/', icon: 'fab fa-instagram' },
    { name: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/', icon: 'fab fa-linkedin' },
    { name: 'youtube', label: 'YouTube', url: 'https://youtube.com/', icon: 'fab fa-youtube' },
    { name: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@', icon: 'fab fa-tiktok' },
  ],
  meta: undefined,
};

const socialMediaSlice = createSlice({
  name: 'socialMedia',
  initialState,
  reducers: {
    setSocialMedias: (
      state,
      action: PayloadAction<{
        socialMedias: SocialMedia[];
        meta?: SocialMediaState['meta'];
      }>
    ) => {
      state.socialMedias = action.payload.socialMedias;
      state.meta = action.payload.meta;
    },
    
    setSelectedSocialMedia: (state, action: PayloadAction<SocialMedia | null>) => {
      state.selectedSocialMedia = action.payload;
    },
    
    addSocialMedia: (state, action: PayloadAction<SocialMedia>) => {
      state.socialMedias.unshift(action.payload);
    },
    
    updateSocialMedia: (state, action: PayloadAction<SocialMedia>) => {
      const index = state.socialMedias.findIndex(sm => sm.id === action.payload.id);
      if (index !== -1) {
        state.socialMedias[index] = action.payload;
      }
      if (state.selectedSocialMedia?.id === action.payload.id) {
        state.selectedSocialMedia = action.payload;
      }
    },
    
    removeSocialMedia: (state, action: PayloadAction<number>) => {
      state.socialMedias = state.socialMedias.filter(sm => sm.id !== action.payload);
      if (state.selectedSocialMedia?.id === action.payload) {
        state.selectedSocialMedia = null;
      }
    },
    
    clearSocialMedias: (state) => {
      state.socialMedias = [];
      state.selectedSocialMedia = null;
      state.meta = undefined;
    },
  },
});

export const { 
  setSocialMedias,
  setSelectedSocialMedia,
  addSocialMedia,
  updateSocialMedia,
  removeSocialMedia,
  clearSocialMedias
} = socialMediaSlice.actions;

export default socialMediaSlice.reducer;