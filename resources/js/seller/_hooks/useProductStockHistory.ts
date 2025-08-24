import { useFetchHistoriesQuery } from '@seller/store/reducers/productStockHistoryApi';
import { useAppSelector } from '@seller/store/store';

const useProductStockHistory = ({
	range,
	customDateRange,
	limit = 20,
	page = 1,
}: {
	range: 'today' | 'week' | 'month' | 'year' | 'custom';
	customDateRange?: { startDate: string; endDate: string };
	limit?: number;
	page?: number;
}) => {
	// fetch all product history with pagination to prevent timeouts
	const { isLoading, isError, error, refetch } = useFetchHistoriesQuery(
		{
			range: range,
			start_date: range === 'custom' ? customDateRange?.startDate : undefined,
			end_date: range === 'custom' ? customDateRange?.endDate : undefined,
			limit: limit,
			page: page,
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	// select product stocks from slice
	const { histories, meta } = useAppSelector(
		(state) => state.productStockHistory
	);


	return {
		histories: histories,
		history,
		meta:  meta, // Don't show pagination for mock data
		isLoading,
		isError: isError, // Don't show error for backend issues, show mock data instead
		error: isError ? error : null,
		refetch,
	};
};

export default useProductStockHistory;
