import { FC } from 'react';
import { Button } from 'flowbite-react';
import { HiSearch, HiFilter, HiX } from 'react-icons/hi';

interface Category {
	id: number;
	name: string;
	slug: string;
}

interface StockReportFiltersProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	selectedCategories: string[];
	onCategoryChange: (categories: string[]) => void;
	itemsPerPage: number;
	onItemsPerPageChange: (count: number) => void;
	categories: Category[];
	isLoadingCategories?: boolean;
}

const StockReportFilters: FC<StockReportFiltersProps> = ({
	searchQuery,
	onSearchChange,
	selectedCategories,
	onCategoryChange,
	itemsPerPage,
	onItemsPerPageChange,
	categories,
	isLoadingCategories = false
}) => {

	const itemsPerPageOptions = [10, 25, 50, 100];

	const handleCategoryToggle = (categoryId: string) => {
		if (selectedCategories.includes(categoryId)) {
			onCategoryChange(selectedCategories.filter(c => c !== categoryId));
		} else {
			onCategoryChange([...selectedCategories, categoryId]);
		}
	};

	const clearAllFilters = () => {
		onSearchChange('');
		onCategoryChange([]);
	};

	return (
		<div className="space-y-4">
			{/* Search Bar */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="flex-1">
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<HiSearch className="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Search by date, period, or any data..."
						/>
					</div>
				</div>

				<div className="flex items-center space-x-2">
					<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
						Show:
					</span>
					<select
						value={itemsPerPage}
						onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
						className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						{itemsPerPageOptions.map(option => (
							<option key={option} value={option}>
								{option} items
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Category Filters */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
						<HiFilter className="w-4 h-4 mr-2" />
						Categories
					</h3>
					{(selectedCategories.length > 0 || searchQuery) && (
						<Button
							size="xs"
							color="gray"
							onClick={clearAllFilters}
							className="text-red-600 hover:text-red-700"
						>
							<HiX className="w-3 h-3 mr-1" />
							Clear All
						</Button>
					)}
				</div>

				<div className="flex flex-wrap gap-2">
					{isLoadingCategories ? (
						<div className="flex items-center space-x-2">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
							<span className="text-sm text-gray-500 dark:text-gray-400">Loading categories...</span>
						</div>
					) : categories.length > 0 ? (
						categories.map(category => (
							<button
								key={category.id}
								onClick={() => handleCategoryToggle(category.id.toString())}
								className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
									selectedCategories.includes(category.id.toString())
										? 'bg-blue-600 text-white border-blue-600'
										: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600'
								}`}
							>
								{category.name}
							</button>
						))
					) : (
						<span className="text-sm text-gray-500 dark:text-gray-400">No categories available</span>
					)}
				</div>

				{/* Active Filters Display */}
				{(selectedCategories.length > 0 || searchQuery) && (
					<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							Active filters:
						</span>
						{searchQuery && (
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
								Search: "{searchQuery}"
								<button
									onClick={() => onSearchChange('')}
									className="ml-1 text-blue-600 hover:text-blue-800"
								>
									<HiX className="w-3 h-3" />
								</button>
							</span>
						)}
						{selectedCategories.map(categoryId => {
							const category = categories.find(c => c.id.toString() === categoryId);
							return (
								<span
									key={categoryId}
									className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
								>
									{category?.name || `Category ${categoryId}`}
									<button
										onClick={() => handleCategoryToggle(categoryId)}
										className="ml-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
									>
										<HiX className="w-3 h-3" />
									</button>
								</span>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default StockReportFilters;