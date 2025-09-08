import React, { useState, useMemo } from 'react';
import { useThemes, useInstalledThemes, Theme } from '../hooks/useThemes';
import { ThemeInstallationModal } from '../components/ThemeInstallationModal';
import { ThemeCard, ThemeCardSkeleton } from '../components/ThemeCard';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc,
  Package
} from 'lucide-react';

// Theme categories
const CATEGORIES = [
  'All',
  'Business', 
  'E-commerce',
  'Portfolio',
  'Blog',
  'Restaurant',
  'Agency',
  'Healthcare',
  'Education',
  'Real Estate'
];


export function ThemeMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'installations' | 'price'>('installations');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInstallModal, setShowInstallModal] = useState<Theme | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  // Build filters for API query
  const filters = useMemo(() => {
    const result: any = {};
    if (selectedCategory !== 'All') result.category = selectedCategory.toLowerCase();
    if (priceFilter !== 'all') result.price = priceFilter;
    return result;
  }, [selectedCategory, priceFilter]);

  const { data: themes = [], isLoading } = useThemes(filters);
  const { data: installedThemes = [] } = useInstalledThemes();

  // Filter and sort themes
  const filteredAndSortedThemes = useMemo(() => {
    // Ensure themes is always an array
    let filtered = Array.isArray(themes) ? themes : [];

    // Apply search filter
    if (searchQuery && filtered.length > 0) {
      filtered = filtered.filter(theme =>
        theme.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort themes - ensure filtered is still an array
    if (Array.isArray(filtered) && filtered.length > 0) {
      filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'installations':
          comparison = (a.installations || 0) - (b.installations || 0);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        default:
          comparison = 0;
      }

        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [themes, searchQuery, sortBy, sortOrder]);

  const handleInstall = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  const handlePreview = (theme: Theme) => {
    if (theme.preview_url) {
      window.open(theme.preview_url, '_blank');
    } else {
      console.log('Preview not available for:', theme.name);
    }
  };

  const handleInstallComplete = () => {
    // Refresh installed themes
    window.location.reload();
  };

  const stats = {
    total: themes.length,
    free: themes.filter(t => t.is_free).length,
    premium: themes.filter(t => !t.is_free).length,
    installed: installedThemes.length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Theme Marketplace</h1>
        <p className="mt-2 text-gray-600">
          Discover beautiful themes to transform your website
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Themes', value: stats.total, color: 'blue' },
          { label: 'Free Themes', value: stats.free, color: 'green' },
          { label: 'Premium Themes', value: stats.premium, color: 'purple' },
          { label: 'Installed', value: stats.installed, color: 'orange' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </button>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="installations">Popularity</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="mb-6">
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ThemeCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedThemes.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredAndSortedThemes.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isInstalled={installedThemes.some(t => t.id === theme.id)}
                onInstall={handleInstall}
                onPreview={handlePreview}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No themes found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Installation Modal */}
      {selectedTheme && (
        <ThemeInstallationModal
          theme={selectedTheme}
          onClose={() => setSelectedTheme(null)}
          onInstallComplete={handleInstallComplete}
        />
      )}
    </div>
  );
}