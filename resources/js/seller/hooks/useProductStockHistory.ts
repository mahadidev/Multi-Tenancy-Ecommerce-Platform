import { useFetchHistoriesQuery } from '@seller/store/reducers/productStockHistoryApi';

import { useAppSelector } from '@seller/store/store';

const useProductStockHistory = ({
	range,
}: {
	range: 'today' | 'week' | 'month' | 'year';
}) => {
	// fetch all product hsitory
	useFetchHistoriesQuery(
		{
			range: range,
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	// select product stocks from slice
	const { histories, history } = useAppSelector(
		(state) => state.productStockHistory
	);

	return {
		histories,
		history,
	};
};

export default useProductStockHistory;
