import { SITE_SLUG } from "@site/site_env";
import { useFetchStoreQuery } from "@site/store/reducers/storeApi";
import { useAppSelector } from "@site/store/store";

const useStore = () => {
	// fetch store
	const { isLoading: isFetchStoreLoading } = useFetchStoreQuery({
		slug: SITE_SLUG,
	});

	// get theme
	const { store } = useAppSelector((state) => state.store);

	return {
		fetchStore: {
			isLoading: isFetchStoreLoading,
		},
		store,
	};
}
export default useStore
