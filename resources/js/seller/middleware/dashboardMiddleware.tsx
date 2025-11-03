import { RoutePath } from '@seller/seller_env';
import { useAppSelector } from '@seller/store/store';
import { Navigate, Outlet } from 'react-router-dom';
import usePermissions from '@seller/_hooks/usePermissions';

const DashboardMiddleware = () => {
	const { user, accessToken } = useAppSelector((state) => state.auth);
	const { store } = useAppSelector((state) => state.store);
	const isRehydrated = useAppSelector((state) => state._persist?.rehydrated);
	const { permissions, hasPermission } = usePermissions();

	// Debug logging (remove in production)
	console.log('DashboardMiddleware Debug:', {
		isRehydrated,
		hasUser: !!user,
		hasAccessToken: !!accessToken,
		hasStore: !!store,
		storeStatus: store?.store_subscription_status,
		userProfileData: user,
		storeOwnerId: store?.owner_id,
		currentUserId: user?.id,
		isOwnerMatch: store?.owner_id === user?.id,
		isStoreOwnerFromProfile: user?.is_store_owner,
		isStoreOwnerFromSession: user?.store_session?.is_owner,
		permissions: permissions,
		hasExpenseView: hasPermission('expenses.view'),
		hasExpenseCreate: hasPermission('expenses.create'),
		hasExpenseEdit: hasPermission('expenses.edit'),
		hasExpenseDelete: hasPermission('expenses.delete')
	});

	// Show loading while rehydration is happening
	if (!isRehydrated) {
		return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
	}

	return (
		<>
			{user && accessToken ? (
				<>
					{/* if logged */}
					{store?.store_subscription_status === 'Expired' ? (
						<Navigate to={RoutePath.SubscriptionPage.index()} />
					) : (
						<>
							{store ? (
								<Outlet />
							) : (
								<Navigate to={RoutePath.Onboard.Store.index()} />
							)}
						</>
					)}
				</>
			) : (
				<Navigate to={RoutePath.LoginPage.index()} />
			)}
		</>
	);
};
export default DashboardMiddleware;
