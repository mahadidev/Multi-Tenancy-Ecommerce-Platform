import {
    CreateStorePayloadType,
    useCreateStoreMutation,
    useFetchStoresQuery,
} from '@seller-panel/store/reducers/storeApi';
import { useAppSelector } from '@seller-panel/store/store';

const useStore = () => {
	// fetch stores
	useFetchStoresQuery();
	// select store
	const { store, stores } = useAppSelector((state) => state.store);

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
			}
		});
	};

	return {
		store,
		stores,
		create: {
			submit: create,
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
		},
	};
};
export default useStore;
