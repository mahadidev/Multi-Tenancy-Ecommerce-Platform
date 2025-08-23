import {
    CreateStorePayloadType,
    SwitchStorePayloadType,
    SwitchThemePayloadType,
    UpdateStorePayloadType,
    useCreateStoreMutation,
    useFetchStoresQuery,
    useFetchStoreTypesQuery,
    useSwitchStoreMutation,
    useSwitchThemeMutation,
    useUpdateStoreMutation,
} from '@seller/store/reducers/storeApi';
import { useAppSelector } from '@seller/store/store';
import useToast from './useToast';

const useStore = () => {
	// fetch stores and types
	useFetchStoresQuery();
	useFetchStoreTypesQuery();

	// show toast message
	const { toaster } = useToast();

	// select store
	const { store, stores, storeTypes, currentStore } = useAppSelector(
		(state) => state.store
	);

	// create store
	const [
		handleCreate,
		{
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
		},
	] = useCreateStoreMutation();
	const create = ({
		formData,
		onSuccess,
	}: {
		formData: CreateStorePayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleCreate(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
				toaster({
					text: 'Store crated successfully.',
					status: 'success',
				});
			} else {
				toaster({
					text: 'Failed to create store',
					status: 'error',
				});
			}
		});
	};

	// update store
	const [
		handleUpdate,
		{
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			error: updateError,
			data: updateData,
		},
	] = useUpdateStoreMutation();
	const update = ({
		formData,
		onSuccess,
	}: {
		formData: UpdateStorePayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleUpdate(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
				toaster({
					text: 'Store updated successfully.',
					status: 'success',
				});
			} else {
				toaster({
					text: 'Failed to update store',
					status: 'error',
				});
			}
		});
	};

	// update store
	const [
		handleSwitchStore,
		{
			isLoading: isSwitchStoreLoading,
			isError: isSwitchStoreError,
			error: switchStoreError,
			data: switchStoreData,
		},
	] = useSwitchStoreMutation();
	const switchStore = ({
		formData,
		onSuccess,
	}: {
		formData: SwitchStorePayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleSwitchStore(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			} else {
				toaster({
					text: 'Failed to switched store',
					status: 'error',
				});
			}
		});
	};

	// active theme
	const [
		handleActiveTheme,
		{
			isLoading: isActiveThemeLoading,
			isError: isActiveThemeError,
			error: activeThemeError,
			data: activeThemeData,
		},
	] = useSwitchThemeMutation();
	const activeTheme = ({
		formData,
		onSuccess,
	}: {
		formData: SwitchThemePayloadType;
		onSuccess?: CallableFunction;
	}) => {
		if (store) {
			handleActiveTheme({
				theme_id: formData.theme_id,
				store_id: store.id,
                import_demo: formData.import_demo
			}).then((response) => {
				if (response.data?.status === 200) {
					if (onSuccess) {
						onSuccess(response.data.data);
					}
					toaster({
						text: 'Theme activate successfully.',
						status: 'success',
					});
				} else {
					toaster({
						text: 'Failed to activate theme',
						status: 'error',
					});
				}
			});
		}
	};

	// deactive theme
	const [
		handleDeactiveTheme,
		{
			isLoading: isDeactiveThemeLoading,
			isError: isDeactiveThemeError,
			error: deactiveThemeError,
			data: deactiveThemeData,
		},
	] = useSwitchThemeMutation();
	const deactiveTheme = ({ onSuccess }: { onSuccess?: CallableFunction }) => {
		if (store) {
			handleDeactiveTheme({
				store_id: store.id,
				theme_id: null,
                import_demo: false,
			}).then((response) => {
				if (response.data?.status === 200) {
					if (onSuccess) {
						onSuccess(response.data.data);
					}

					toaster({
						text: 'Theme deactivate successfully.',
						status: 'success',
					});
				} else {
					toaster({
						text: 'Failed to deactivate theme',
						status: 'error',
					});
				}
			});
		}
	};

	return {
		store,
		stores,
		storeTypes,
		currentStore,
		create: {
			submit: create,
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
		},
		update: {
			submit: update,
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			error: updateError,
			data: updateData,
		},
		switchStore: {
			submit: switchStore,
			isLoading: isSwitchStoreLoading,
			isError: isSwitchStoreError,
			error: switchStoreError,
			data: switchStoreData,
		},
		activeTheme: {
			submit: activeTheme,
			isLoading: isActiveThemeLoading,
			isError: isActiveThemeError,
			error: activeThemeError,
			data: activeThemeData,
		},
		deactiveTheme: {
			submit: deactiveTheme,
			isLoading: isDeactiveThemeLoading,
			isError: isDeactiveThemeError,
			error: deactiveThemeError,
			data: deactiveThemeData,
		},
	};
};
export default useStore;
