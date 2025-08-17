import { DataTablePropsType } from '@type/tableType';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const useTable = (props: DataTablePropsType) => {
	const [searchParams, setSearchParams] = useSearchParams();

	// Get from URL
	const queryPage = parseInt(searchParams.get('page') || '1', 10);
	const querySortKey = searchParams.get('sortBy') || null;
	const querySortDir = searchParams.get('sortDir') as 'asc' | 'desc' | null;
	const querySearch = searchParams.get('search') || '';

	// States
	const [searchQuery, setSearchQuery] = useState(querySearch);
	const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(
		querySortKey && querySortDir
			? { key: querySortKey, dir: querySortDir }
			: null
	);
	const [data, setData] = useState(props.data || []);
	const [currentPage, setCurrentPage] = useState(queryPage || 1);

	// Pagination constants
	const rowsPerPage = 10;
	const totalPages = Math.ceil(data.length / rowsPerPage);
	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;

	// Refresh data from props
	useEffect(() => {
		setData(props.data);
	}, [props.data]);

	// Sort logic
	const sortData = ({
		sort,
		data,
	}: {
		sort: { key: string; dir: 'asc' | 'desc' };
		data: any[];
	}) => {
		return [...data].sort((a, b) => {
			if (a[sort.key] < b[sort.key]) return sort.dir === 'asc' ? -1 : 1;
			if (a[sort.key] > b[sort.key]) return sort.dir === 'asc' ? 1 : -1;
			return 0;
		});
	};

	// Update URL on any state change
	const updateURLParams = ({
		page = currentPage,
		sortKey = sort?.key,
		sortDir = sort?.dir,
		search = searchQuery,
	}: {
		page?: number;
		sortKey?: string | null;
		sortDir?: 'asc' | 'desc' | null;
		search?: string;
	}) => {
		const newParams = new URLSearchParams();

		if (page > 1) newParams.set('page', page.toString());
		if (sortKey && sortDir) {
			newParams.set('sortBy', sortKey);
			newParams.set('sortDir', sortDir);
		}
		if (search?.trim()) newParams.set('search', search.trim());

		setSearchParams(newParams);
	};

	// Page change handler
	const onNextPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
			updateURLParams({ page });
		}
	};

	// Sort column handler
	const onSort = (key: string) => {
		setCurrentPage(1);

		setSort((prev) => {
			let nextSort: typeof prev;

			if (!prev || prev.key !== key) {
				nextSort = { key, dir: 'desc' };
			} else if (prev.dir === 'desc') {
				nextSort = { key, dir: 'asc' };
			} else {
				nextSort = null;
			}

			// Update data
			if (nextSort) {
				setData(sortData({ sort: nextSort, data }));
			} else {
				setData(props.data);
			}

			// Update URL
			updateURLParams({
				page: 1,
				sortKey: nextSort?.key || null,
				sortDir: nextSort?.dir || null,
			});

			return nextSort;
		});
	};

	// Search handler
	const onSearch = (query: string, onlySearch = false) => {
		setSearchQuery(query);
		setCurrentPage(1);

		let filteredData = props.data;

		if (props?.search?.columns?.length) {
			const lowerQuery = query.toLowerCase();
			filteredData = props.data.filter((item) =>
				props?.search?.columns.some((col) =>
					item[col]?.toString().toLowerCase().includes(lowerQuery)
				)
			);
		}

		// Apply sort if already exists
		if (sort && !onlySearch) {
			filteredData = sortData({ sort, data: filteredData });
		}

		setData(filteredData);

		// Update URL
		updateURLParams({
			page: 1,
			sortKey: sort?.key || null,
			sortDir: sort?.dir || null,
			search: query,
		});
	};

	// On initial mount: apply search & sort from URL
	useEffect(() => {
		let filteredData = props.data;

		if (querySearch) {
			const lower = querySearch.toLowerCase();
			filteredData = filteredData.filter((item) =>
				props?.search?.columns.some((col) =>
					item[col]?.toString()?.toLowerCase().includes(lower)
				)
			);
		}

		if (querySortKey && querySortDir) {
			filteredData = sortData({
				sort: { key: querySortKey, dir: querySortDir },
				data: filteredData,
			});
		}

		setData(filteredData);
	}, [props.data, props?.search?.columns, querySearch, querySortDir, querySortKey]);

	return {
		paginate: {
			totalPages,
			indexOfLastRow,
			indexOfFirstRow,
			currentPage,
			currentData: Array.isArray(data)
				? data.slice(indexOfFirstRow, indexOfLastRow)
				: [],
			onNextPage,
		},
		columns: props.columns,
		data,
		setData,
		sort,
		setSort,
		onSort,
		onSearch,
		searchQuery,
		setSearchQuery,
	};
};

export default useTable;
