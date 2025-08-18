import { defaultModeExternalPages, defaultModePages } from './DefaultMode';
import { ecommerceModeExternalPages, ecommerceModePages } from './EcommerceMode';
import { getPermissionAwareNavigation } from './PermissionAwareMode';
import usePermissions from '@seller/hooks/usePermissions';

export const useMode = (type: 'e-commerce' | 'default' | 'permission-aware') => {
	const { userPermissions, isStoreOwner } = usePermissions();
	
	if (type === 'permission-aware') {
		return getPermissionAwareNavigation(userPermissions, isStoreOwner);
	} else if (type === 'e-commerce') {
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
