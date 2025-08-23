import { FC } from 'react';
import { HiSearch } from 'react-icons/hi';

interface SearchResult {
    id: string;
    title: string;
    type: 'product' | 'category' | 'customer' | 'order' | 'expense' | 'vendor' | 'field' | 'page' | 'feature';
    description?: string;
    url: string;
    icon?: string;
    section?: string;
}

interface SearchDropdownProps {
    isOpen: boolean;
    results: SearchResult[];
    isLoading: boolean;
    onResultClick: (result: SearchResult) => void;
    query: string;
}

const SearchDropdown: FC<SearchDropdownProps> = ({
    isOpen,
    results,
    isLoading,
    onResultClick,
    query,
}) => {
    if (!isOpen) return null;

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'product': return 'Product';
            case 'category': return 'Category';
            case 'customer': return 'Customer';
            case 'order': return 'Order';
            case 'expense': return 'Expense';
            case 'vendor': return 'Vendor';
            case 'field': return 'Setting';
            case 'page': return 'Page';
            case 'feature': return 'Feature';
            default: return type;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'product': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'category': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'customer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'order': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'expense': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'vendor': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            case 'field': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
            case 'page': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
            case 'feature': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto dark:bg-gray-800 dark:border-gray-600">
            {isLoading ? (
                <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
                </div>
            ) : results.length > 0 ? (
                <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">
                        Search Results for "{query}"
                    </div>
                    {results.map((result) => (
                        <button
                            key={result.id}
                            onClick={() => onResultClick(result)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <span className="text-lg">{result.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {result.title}
                                        </p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                                            {getTypeLabel(result.type)}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {result.section && (
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                                {result.section}
                                            </p>
                                        )}
                                        {result.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {result.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <HiSearch className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            ) : query.length >= 2 ? (
                <div className="px-4 py-6 text-center">
                    <HiSearch className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No results found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        No items found for "{query}". Try a different search term.
                    </p>
                </div>
            ) : (
                <div className="px-4 py-6 text-center">
                    <HiSearch className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Start searching</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Type at least 2 characters to search across products, customers, orders, and more.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;