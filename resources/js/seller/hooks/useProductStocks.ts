import { useFetchProductStocksSummaryQuery } from '@seller/store/reducers/productStocksApi';
import { useAppSelector } from '@seller/store/store';

const useProductStocks = ({
	summaryFilterRange,
	customDateRange,
}: {
	summaryFilterRange?: 'today' | 'week' | 'month' | 'year' | 'custom';
	customDateRange?: { startDate: string; endDate: string };
}) => {
	// Fetch product stocks summary
	const { isLoading, isError, error, refetch } = useFetchProductStocksSummaryQuery(
		{
			range: summaryFilterRange ?? 'week',
			start_date: summaryFilterRange === 'custom' ? customDateRange?.startDate : undefined,
			end_date: summaryFilterRange === 'custom' ? customDateRange?.endDate : undefined,
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	// Select product stocks summary from store
	const { summary } = useAppSelector((state) => state.productStocks);

	return {
		summary,
		isLoading,
		isError,
		error,
		refetch,
	};
};

export default useProductStocks;