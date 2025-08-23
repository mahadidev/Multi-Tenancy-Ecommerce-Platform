import usePermissions from '@seller/_hooks/usePermissions';
import { defaultModeExternalPages, defaultModePages } from './DefaultMode';
import { ecommerceModeExternalPages, ecommerceModePages } from './EcommerceMode';
import { getPermissionAwareNavigation } from './PermissionAwareMode';

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
