import { defaultModeExternalPages, defaultModePages } from './DefaultMode';
import { ecommerceModeExternalPages, ecommerceModePages } from './EcommerceMode';

export const useMode = (type: 'e-commerce' | 'default') => {
	if (type === 'e-commerce') {
		return {
			pages: ecommerceModePages,
			externalPages: ecommerceModeExternalPages,
		};
	} else {
		return {
			pages: defaultModePages,
			externalPages: defaultModeExternalPages,
		};
	}
};
