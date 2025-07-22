import {
    useFetchAllProductStockHistoryQuery,
    useFetchProductStockHistoryQuery,
} from '@seller/store/reducers/productStockHistoryApi';

import { useAppSelector } from '@seller/store/store';

const useProductStockHistory = ({
	id,
	range,
}: {
	id?: number | string;
	range: 'today' | 'week' | 'month' | 'year';
}) => {
	// fetch all product hsitory
	useFetchAllProductStockHistoryQuery({
		range: range,
	},
    {
        refetchOnMountOrArgChange: true,
    });

	// fetch stock history
	useFetchProductStockHistoryQuery(
		{ productId: id ?? 1 },
		{ skip: !id, refetchOnMountOrArgChange: true } // <-- skips the query when id is null/undefined/false
	);

	// select product stocks from slice
	const { allProductStockHistory, productStockHistory } = useAppSelector(
		(state) => state.productStockHistory
	);

	return {
		allProductStockHistory,
		productStockHistory,
	};
};

export default useProductStockHistory;
