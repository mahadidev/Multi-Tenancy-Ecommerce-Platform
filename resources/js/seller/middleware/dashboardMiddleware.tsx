import { RoutePath } from '@seller/seller_env';
import { useAppSelector } from '@seller/store/store';
import { Navigate, Outlet } from 'react-router-dom';
import usePermissions from '@seller/_hooks/usePermissions';

const DashboardMiddleware = () => {
	const { user, accessToken } = useAppSelector((state) => state.auth);
	const { store } = useAppSelector((state) => state.store);
	const isRehydrated = useAppSelector((state) => state._persist?.rehydrated);
	const { hasPermission } = usePermissions();
	const permissions = (usePermissions() as any).permissions || [];

	// Debug logging (remove in production)
	console.log('DashboardMiddleware Debug:', {
		isRehydrated,
		hasUser: !!user,
		hasAccessToken: !!accessToken,
		hasStore: !!store,
		storeStatus: store?.store_subscription_status,
		userProfileData: user,
		storeOwnerId: (store as any)?.owner_id,
		currentUserId: (user as any)?.id,
		isOwnerMatch: (store as any)?.owner_id === (user as any)?.id,
		isStoreOwnerFromProfile: (user as any)?.is_store_owner,
		isStoreOwnerFromSession: (user as any)?.store_session?.is_owner,
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
