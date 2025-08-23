import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@seller/seller_env';

interface SearchResult {
    id: string;
    title: string;
    type: 'product' | 'category' | 'customer' | 'order' | 'expense' | 'vendor' | 'field' | 'page' | 'feature';
    description?: string;
    url: string;
    icon?: string;
    section?: string; // For organizing results
}

interface SearchResults {
    products: SearchResult[];
    categories: SearchResult[];
    customers: SearchResult[];
    orders: SearchResult[];
    expenses: SearchResult[];
    vendors: SearchResult[];
    fields: SearchResult[];
    pages: SearchResult[];
    features: SearchResult[];
}

const useSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults>({
        products: [],
        categories: [],
        customers: [],
        orders: [],
        expenses: [],
        vendors: [],
        fields: [],
        pages: [],
        features: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Search database for fields, pages, and features
    const searchDatabase = useCallback(() => {
        const allSearchableItems = [
            // Settings Fields
            { id: 'logo', title: 'Store Logo', type: 'field', description: 'Upload your store logo', url: RoutePath.SettingsPage.index(), icon: '🖼️', section: 'General Settings', keywords: ['logo', 'store logo', 'brand', 'image'] },
            { id: 'name', title: 'Store Name', type: 'field', description: 'Your store name', url: RoutePath.SettingsPage.index(), icon: '🏪', section: 'General Settings', keywords: ['store name', 'name', 'business name'] },
            { id: 'description', title: 'Store Description', type: 'field', description: 'Brief description of your store', url: RoutePath.SettingsPage.index(), icon: '📝', section: 'General Settings', keywords: ['description', 'store description', 'about'] },
            { id: 'email', title: 'Store Email', type: 'field', description: 'Store contact email', url: RoutePath.SettingsPage.index(), icon: '📧', section: 'General Settings', keywords: ['email', 'contact email', 'store email'] },
            { id: 'phone', title: 'Store Phone', type: 'field', description: 'Store contact phone', url: RoutePath.SettingsPage.index(), icon: '📞', section: 'General Settings', keywords: ['phone', 'contact phone', 'telephone', 'mobile'] },
            { id: 'address', title: 'Store Address', type: 'field', description: 'Store physical address', url: RoutePath.SettingsPage.index(), icon: '📍', section: 'General Settings', keywords: ['address', 'location', 'store address'] },
            
            // Access Management
            { id: 'roles', title: 'User Roles', type: 'field', description: 'Manage user roles and permissions', url: RoutePath.AccessManagementPage.index(), icon: '👥', section: 'Access Management', keywords: ['roles', 'user roles', 'permissions', 'access'] },
            { id: 'permissions', title: 'Permissions', type: 'field', description: 'Set user permissions', url: RoutePath.AccessManagementPage.index(), icon: '🔒', section: 'Access Management', keywords: ['permissions', 'access control', 'rights'] },
            { id: 'store-admin', title: 'Store Admin', type: 'field', description: 'Manage store administrators', url: RoutePath.StoreAdminPage.index(), icon: '👤', section: 'Store Admin', keywords: ['admin', 'administrator', 'store admin'] },
            
            // Product Fields
            { id: 'product-name', title: 'Product Name', type: 'field', description: 'Product title and name', url: RoutePath.ProductsPage.index(), icon: '📦', section: 'Products', keywords: ['product name', 'title', 'product title'] },
            { id: 'product-price', title: 'Product Price', type: 'field', description: 'Product pricing', url: RoutePath.ProductsPage.index(), icon: '💰', section: 'Products', keywords: ['price', 'pricing', 'cost', 'amount'] },
            { id: 'product-category', title: 'Product Category', type: 'field', description: 'Product categorization', url: RoutePath.ProductsPage.index(), icon: '🏷️', section: 'Products', keywords: ['category', 'categories', 'classification'] },
            { id: 'inventory', title: 'Inventory', type: 'field', description: 'Stock management', url: RoutePath.ProductsPage.index(), icon: '📊', section: 'Products', keywords: ['inventory', 'stock', 'quantity', 'stock level'] },
            
            // Pages
            { id: 'dashboard', title: 'Dashboard', type: 'page', description: 'Main dashboard overview', url: RoutePath.DashboardPage.index(), icon: '📊', keywords: ['dashboard', 'overview', 'home', 'main'] },
            { id: 'products', title: 'Products', type: 'page', description: 'Manage your products', url: RoutePath.ProductsPage.index(), icon: '📦', keywords: ['products', 'items', 'catalog'] },
            { id: 'categories', title: 'Categories', type: 'page', description: 'Product categories', url: RoutePath.CategoriesPage.index(), icon: '🏷️', keywords: ['categories', 'classification', 'groups'] },
            { id: 'orders', title: 'Orders', type: 'page', description: 'Customer orders', url: RoutePath.OrdersPage.index(), icon: '🛒', keywords: ['orders', 'purchases', 'sales'] },
            { id: 'customers', title: 'Customers', type: 'page', description: 'Customer management', url: RoutePath.CustomersPage.index(), icon: '👤', keywords: ['customers', 'clients', 'users'] },
            { id: 'expenses', title: 'Expenses', type: 'page', description: 'Business expenses', url: RoutePath.ExpensesPage.index(), icon: '💰', keywords: ['expenses', 'costs', 'spending'] },
            { id: 'vendors', title: 'Vendors', type: 'page', description: 'Supplier management', url: RoutePath.VendorsPage.index(), icon: '🏢', keywords: ['vendors', 'suppliers', 'providers'] },
            { id: 'settings', title: 'Settings', type: 'page', description: 'Store settings', url: RoutePath.SettingsPage.index(), icon: '⚙️', keywords: ['settings', 'configuration', 'preferences'] },
            
            // Features
            { id: 'trending-products', title: 'Trending Products', type: 'feature', description: 'View trending product analytics', url: RoutePath.DashboardPage.index(), icon: '📈', keywords: ['trending', 'popular', 'analytics', 'insights'] },
            { id: 'sales-chart', title: 'Sales Analytics', type: 'feature', description: 'Sales performance charts', url: RoutePath.DashboardPage.index(), icon: '📊', keywords: ['sales', 'analytics', 'charts', 'revenue'] },
            { id: 'export', title: 'Export Data', type: 'feature', description: 'Export business data', url: RoutePath.ProductsPage.index(), icon: '📤', keywords: ['export', 'download', 'data export'] },
            { id: 'reports', title: 'Reports', type: 'feature', description: 'Business reports', url: RoutePath.DashboardPage.index(), icon: '📋', keywords: ['reports', 'analytics', 'insights'] },
        ];
        
        return allSearchableItems;
    }, []);

    // Search function
    const searchItems = useCallback(async (searchQuery: string): Promise<SearchResults> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const query = searchQuery.toLowerCase().trim();
        const searchableItems = searchDatabase();
        
        // Filter items based on search query
        const filteredItems = searchableItems.filter(item => {
            return item.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
                   item.title.toLowerCase().includes(query) ||
                   item.description?.toLowerCase().includes(query) ||
                   item.section?.toLowerCase().includes(query);
        });

        // Categorize results
        const categorizedResults: SearchResults = {
            products: [],
            categories: [],
            customers: [],
            orders: [],
            expenses: [],
            vendors: [],
            fields: filteredItems.filter(item => item.type === 'field') as SearchResult[],
            pages: filteredItems.filter(item => item.type === 'page') as SearchResult[],
            features: filteredItems.filter(item => item.type === 'feature') as SearchResult[],
        };

        return categorizedResults;
    }, [searchDatabase]);

    // Debounced search effect
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults({
                products: [],
                categories: [],
                customers: [],
                orders: [],
                expenses: [],
                vendors: [],
                fields: [],
                pages: [],
                features: [],
            });
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const searchResults = await searchItems(query);
                setResults(searchResults);
            } catch (error) {
                console.error('Search error:', error);
                setResults({
                    products: [],
                    categories: [],
                    customers: [],
                    orders: [],
                    expenses: [],
                    vendors: [],
                    fields: [],
                    pages: [],
                    features: [],
                });
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, searchItems]);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        setIsOpen(searchQuery.length >= 2);
    };

    const handleResultClick = (result: SearchResult) => {
        navigate(result.url);
        setIsOpen(false);
        setQuery('');
    };

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
        setResults({
            products: [],
            categories: [],
            customers: [],
            orders: [],
            expenses: [],
            vendors: [],
            fields: [],
            pages: [],
            features: [],
        });
    };

    const getAllResults = (): SearchResult[] => {
        return [
            ...results.fields,
            ...results.pages,
            ...results.features,
            ...results.products,
            ...results.categories,
            ...results.customers,
            ...results.orders,
            ...results.expenses,
            ...results.vendors,
        ];
    };

    const hasResults = getAllResults().length > 0;

    return {
        query,
        results,
        isLoading,
        isOpen,
        hasResults,
        handleSearch,
        handleResultClick,
        clearSearch,
        setIsOpen,
        getAllResults,
    };
};

export default useSearch;