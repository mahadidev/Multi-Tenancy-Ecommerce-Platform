import { useState, useEffect, useCallback, useMemo } from 'react';
import { TopProductType } from '@type/orderType';

export interface TrendingProductsParams {
	filterType: 'top_selling' | 'most_revenue' | 'most_profitable' | 'recently_popular';
	timeRange: 'today' | 'last7days' | 'last30days' | 'last1year';
	limit?: number;
}

export interface TrendingProductsResponse {
	products: TopProductType[];
	total: number;
	period: string;
	filter_type: string;
	current_page: number;
	per_page: number;
	has_more: boolean;
	success: boolean;
	message?: string;
}

export interface UseTrendingProductsReturn {
	products: TopProductType[];
	isLoading: boolean;
	isError: boolean;
	error: string | null;
	total: number;
	period: string;
	refetch: () => void;
	hasNextPage: boolean;
	loadMore: () => void;
	isLoadingMore: boolean;
}

const useTrendingProducts = (params: TrendingProductsParams): UseTrendingProductsReturn => {
	const [products, setProducts] = useState<TopProductType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [total, setTotal] = useState(0);
	const [period, setPeriod] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	
	const limit = params.limit || 8;

	const fetchTrendingProducts = useCallback(async (page = 1, append = false) => {
		try {
			if (page === 1) {
				setIsLoading(true);
				setIsError(false);
				setError(null);
			} else {
				setIsLoadingMore(true);
			}

			// Get auth token from Redux persist store
			let accessToken = '';
			try {
				const persistData = localStorage.getItem('persist:seller');
				if (persistData) {
					const parsedData = JSON.parse(persistData);
					if (parsedData.auth) {
						const authData = JSON.parse(parsedData.auth);
						accessToken = authData.accessToken || '';
					}
				}
			} catch (e) {
				console.error('Error getting auth token:', e);
			}

			// API call to the new dedicated trending products endpoint
			const response = await fetch('/api/v1/seller/analytics/trending-products', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					filter_type: params.filterType,
					time_range: params.timeRange,
					limit,
					page,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: TrendingProductsResponse = await response.json();

			if (data.success) {
				setProducts(prev => append ? [...prev, ...data.products] : data.products);
				setTotal(data.total);
				setPeriod(data.period);
				setCurrentPage(data.current_page);
				setHasMoreData(data.has_more);
			} else {
				throw new Error(data.message || 'Failed to fetch trending products');
			}
		} catch (err) {
			console.error('Error fetching trending products:', err);
			setIsError(true);
			setError(err instanceof Error ? err.message : 'An unknown error occurred');
			
			// Fallback data for development/testing
			if (process.env['NODE_ENV'] === 'development') {
				const mockProducts = generateMockProducts(params);
				setProducts(prev => append ? [...prev, ...mockProducts.products] : mockProducts.products);
				setTotal(mockProducts.total);
				setPeriod(mockProducts.period);
				setHasMoreData(false);
			}
		} finally {
			setIsLoading(false);
			setIsLoadingMore(false);
		}
	}, [params.filterType, params.timeRange, limit]);

	// Generate mock data for development using your actual products
	const generateMockProducts = (params: TrendingProductsParams): TrendingProductsResponse => {
		const mockProducts: TopProductType[] = [
			{
				product_id: 8,
				total_quantity: 150,
				total_revenue: 45000,
				product: {
					id: 8,
					name: 'Drop Shoulder T-Shirt',
					thumbnail: null, // Let frontend handle placeholder
				} as any
			},
			{
				product_id: 9,
				total_quantity: 120,
				total_revenue: 36000,
				product: {
					id: 9,
					name: 'Goose fancy',
					thumbnail: null, // Let frontend handle placeholder
				} as any
			},
			{
				product_id: 10,
				total_quantity: 95,
				total_revenue: 28500,
				product: {
					id: 10,
					name: 'Goose Solid',
					thumbnail: null, // Let frontend handle placeholder
				} as any
			},
			{
				product_id: 11,
				total_quantity: 80,
				total_revenue: 24000,
				product: {
					id: 11,
					name: 'Banzo Drop',
					thumbnail: null, // Let frontend handle placeholder
				} as any
			},
			{
				product_id: 13,
				total_quantity: 65,
				total_revenue: 19500,
				product: {
					id: 13,
					name: 'commando platon',
					thumbnail: null, // Let frontend handle placeholder
				} as any
			}
		];

		// Sort based on filter type
		let sortedProducts = [...mockProducts];
		switch (params.filterType) {
			case 'most_revenue':
				sortedProducts.sort((a, b) => b.total_revenue - a.total_revenue);
				break;
			case 'most_profitable':
				sortedProducts.sort((a, b) => (b.total_revenue * 0.3) - (a.total_revenue * 0.3));
				break;
			case 'recently_popular':
				sortedProducts.sort((a, b) => b.total_quantity - a.total_quantity);
				break;
			case 'top_selling':
			default:
				sortedProducts.sort((a, b) => b.total_quantity - a.total_quantity);
				break;
		}

		return {
			products: sortedProducts,
			total: sortedProducts.length,
			period: params.timeRange,
			filter_type: params.filterType,
			current_page: 1,
			per_page: sortedProducts.length,
			has_more: false,
			success: true
		};
	};

	const refetch = useCallback(() => {
		setCurrentPage(1);
		fetchTrendingProducts(1, false);
	}, [fetchTrendingProducts]);

	const loadMore = useCallback(() => {
		if (!isLoadingMore && hasNextPage) {
			fetchTrendingProducts(currentPage + 1, true);
		}
	}, [fetchTrendingProducts, currentPage, isLoadingMore]);

	const [hasMoreData, setHasMoreData] = useState(false);

	const hasNextPage = useMemo(() => {
		return hasMoreData && products.length < total;
	}, [hasMoreData, products.length, total]);

	// Fetch data when params change
	useEffect(() => {
		fetchTrendingProducts(1, false);
	}, [fetchTrendingProducts]);

	return {
		products,
		isLoading,
		isError,
		error,
		total,
		period,
		refetch,
		hasNextPage,
		loadMore,
		isLoadingMore,
	};
};

export default useTrendingProducts;