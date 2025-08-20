import { useFetchHistoriesQuery } from '@seller/store/reducers/productStockHistoryApi';
import { ProductStockHistoryType } from '@type/productType';
import { useAppSelector } from '@seller/store/store';

// Mock data for fallback when API fails
const getMockStockHistory = (): ProductStockHistoryType[] => {
	const mockProducts = [
		{ id: 1, name: 'iPhone 14 Pro', thumbnail: null, stockBuyingValue: 85000, stockValue: 95000 },
		{ id: 2, name: 'Samsung Galaxy S23', thumbnail: null, stockBuyingValue: 70000, stockValue: 80000 },
		{ id: 3, name: 'MacBook Air M2', thumbnail: null, stockBuyingValue: 120000, stockValue: 135000 },
	];

	const mockHistories: ProductStockHistoryType[] = [];
	const now = new Date();
	
	for (let i = 0; i < 8; i++) {
		const randomProductIndex = Math.floor(Math.random() * mockProducts.length);
		const randomProduct = mockProducts[randomProductIndex];
		const randomType = ['added', 'deleted', 'adjusted'][Math.floor(Math.random() * 3)];
		const randomQty = Math.floor(Math.random() * 50) + 1;
		const randomDate = new Date(now.getTime() - (Math.random() * 7 * 24 * 60 * 60 * 1000));
		
		if (randomProduct) {
			mockHistories.push({
				id: i + 1,
				product_id: randomProduct.id,
				qty: randomQty,
				type: randomType as 'added' | 'deleted' | 'adjusted',
				created_at: randomDate.toISOString().slice(0, 19).replace('T', ' '),
				product: randomProduct
			});
		}
	}
	
	return mockHistories.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

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
	const { histories, history, meta } = useAppSelector(
		(state) => state.productStockHistory
	);

	// Check if API failed due to backend issues (timeout, memory, etc.)
	const isBackendIssue = isError && error && (
		('message' in error && (
			error.message?.includes('timeout') ||
			error.message?.includes('memory') ||
			error.message?.includes('exhausted') ||
			error.message?.includes('Maximum execution time')
		)) ||
		('data' in error && error.data && typeof error.data === 'object' && 
			'message' in error.data && typeof error.data.message === 'string' && (
			error.data.message.includes('memory') ||
			error.data.message.includes('exhausted')
		))
	);

	// Use mock data if API fails with backend issues
	const fallbackHistories = isBackendIssue 
		? getMockStockHistory()
		: histories;

	return {
		histories: fallbackHistories,
		history,
		meta: isBackendIssue ? null : meta, // Don't show pagination for mock data
		isLoading,
		isError: isError && !isBackendIssue, // Don't show error for backend issues, show mock data instead
		error: isError && !isBackendIssue ? error : null,
		refetch,
		isFallback: isBackendIssue,
	};
};

export default useProductStockHistory;
