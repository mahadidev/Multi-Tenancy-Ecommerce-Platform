import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Spinner, Alert, Tabs } from 'flowbite-react';
import { 
  HiEye, HiDownload, HiStar, HiSparkles, HiTemplate, HiColorSwatch,
  HiDeviceDesktop, HiShoppingCart, HiPhotograph, HiHeart, HiFire
} from 'react-icons/hi';

interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string;
  previewUrl: string;
  isPremium: boolean;
  rating: number;
  downloads: number;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  demoPages: string[];
  isPopular?: boolean;
  isNew?: boolean;
}

const THEME_CATEGORIES = [
  { id: 'all', name: 'All Themes', icon: HiTemplate },
  { id: 'modern', name: 'Modern', icon: HiSparkles },
  { id: 'minimal', name: 'Minimal', icon: HiDeviceDesktop },
  { id: 'creative', name: 'Creative', icon: HiPhotograph },
  { id: 'luxury', name: 'Luxury', icon: HiStar },
  { id: 'tech', name: 'Tech & Electronics', icon: HiShoppingCart },
  { id: 'food', name: 'Food & Restaurant', icon: HiHeart },
];

const SAMPLE_THEMES: Theme[] = [
  {
    id: '1',
    name: 'Modern E-commerce',
    slug: 'modern-ecommerce',
    description: 'Clean and modern design perfect for fashion, electronics, and lifestyle stores',
    category: 'modern',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/preview/modern-ecommerce',
    isPremium: false,
    rating: 4.8,
    downloads: 2340,
    features: ['Responsive Design', 'Dark Mode', 'SEO Optimized', 'Fast Loading'],
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B'
    },
    demoPages: ['Home', 'Products', 'About', 'Contact'],
    isPopular: true
  },
  {
    id: '2',
    name: 'Minimalist Store',
    slug: 'minimalist-store',
    description: 'Simple and elegant design focusing on products with minimal distractions',
    category: 'minimal',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/preview/minimalist-store',
    isPremium: false,
    rating: 4.9,
    downloads: 1820,
    features: ['Clean Layout', 'Mobile First', 'Fast Checkout', 'Product Focus'],
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#E11D48'
    },
    demoPages: ['Home', 'Shop', 'Product', 'Cart']
  },
  {
    id: '3',
    name: 'Bold & Colorful',
    slug: 'bold-colorful',
    description: 'Vibrant and energetic design perfect for youth-oriented brands',
    category: 'creative',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/preview/bold-colorful',
    isPremium: false,
    rating: 4.7,
    downloads: 1560,
    features: ['Vibrant Colors', 'Animation Effects', 'Social Integration', 'Blog Ready'],
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#FBBF24'
    },
    demoPages: ['Home', 'Collections', 'Blog', 'About'],
    isNew: true
  },
  {
    id: '4',
    name: 'Luxury Premium',
    slug: 'luxury-premium',
    description: 'Sophisticated design for high-end products and luxury brands',
    category: 'luxury',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/preview/luxury-premium',
    isPremium: true,
    rating: 5.0,
    downloads: 890,
    features: ['Premium Design', 'Exclusive Components', 'Advanced Animations', 'Priority Support'],
    colors: {
      primary: '#D4AF37',
      secondary: '#1A1A1A',
      accent: '#8B7355'
    },
    demoPages: ['Home', 'Collections', 'Product Details', 'About'],
    isPopular: true
  },
  {
    id: '5',
    name: 'Tech & Gadgets',
    slug: 'tech-gadgets',
    description: 'Modern tech-focused design for electronics and gadget stores',
    category: 'tech',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/preview/tech-gadgets',
    isPremium: false,
    rating: 4.6,
    downloads: 2100,
    features: ['Product Comparisons', 'Tech Specs Display', 'Review System', 'Wishlist'],
    colors: {
      primary: '#0EA5E9',
      secondary: '#6366F1',
      accent: '#10B981'
    },
    demoPages: ['Home', 'Products', 'Compare', 'Support']
  },
  {
    id: '6',
    name: 'Food & Restaurant',
    slug: 'food-restaurant',
    description: 'Appetizing design for food delivery and restaurant websites',
    category: 'food',
    thumbnail: '/api/placeholder/400/300',
    previewUrl: '/preview/food-restaurant',
    isPremium: false,
    rating: 4.8,
    downloads: 1340,
    features: ['Menu Display', 'Online Ordering', 'Delivery Integration', 'Table Booking'],
    colors: {
      primary: '#DC2626',
      secondary: '#EA580C',
      accent: '#16A34A'
    },
    demoPages: ['Home', 'Menu', 'Order', 'Contact'],
    isNew: true
  }
];

const ThemeCard: React.FC<{
  theme: Theme;
  onPreview: (theme: Theme) => void;
  onSelect: (theme: Theme) => void;
}> = ({ theme, onPreview, onSelect }) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      {theme.isPopular && (
        <div className="absolute top-3 left-3 z-10">
          <Badge color="warning" icon={HiFire}>Popular</Badge>
        </div>
      )}
      
      {theme.isNew && (
        <div className="absolute top-3 left-3 z-10">
          <Badge color="success" icon={HiSparkles}>New</Badge>
        </div>
      )}

      {theme.isPremium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge color="purple" icon={HiStar}>Premium</Badge>
        </div>
      )}

      <div className="relative overflow-hidden">
        <img
          src={theme.thumbnail}
          alt={theme.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
            <Button
              size="sm"
              color="white"
              onClick={() => onPreview(theme)}
            >
              <HiEye className="mr-1 w-4 h-4" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{theme.name}</h3>
          <div className="flex items-center space-x-1">
            <HiStar className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{theme.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{theme.description}</p>

        {/* Color Palette */}
        <div className="flex items-center space-x-1 mb-3">
          <HiColorSwatch className="w-4 h-4 text-gray-500" />
          <div className="flex space-x-1">
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {theme.features.slice(0, 3).map((feature) => (
            <Badge key={feature} size="sm" color="gray">
              {feature}
            </Badge>
          ))}
          {theme.features.length > 3 && (
            <Badge size="sm" color="gray">+{theme.features.length - 3} more</Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <HiDownload className="w-4 h-4" />
            <span>{theme.downloads.toLocaleString()} downloads</span>
          </div>
          <span>{theme.demoPages.length} demo pages</span>
        </div>

        <Button
          onClick={() => onSelect(theme)}
          className="w-full"
          color={theme.isPremium ? "purple" : "blue"}
        >
          {theme.isPremium ? 'Get Premium Theme' : 'Select Theme'}
        </Button>
      </div>
    </Card>
  );
};

const ThemePreview: React.FC<{
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (theme: Theme) => void;
}> = ({ theme, isOpen, onClose, onSelect }) => {
  const [activeDemo, setActiveDemo] = useState(0);

  return (
    <Modal show={isOpen} onClose={onClose} size="7xl">
      <Modal.Header>
        <div className="flex items-center space-x-3">
          <span>{theme.name}</span>
          {theme.isPremium && <Badge color="purple">Premium</Badge>}
          {theme.isPopular && <Badge color="warning">Popular</Badge>}
          {theme.isNew && <Badge color="success">New</Badge>}
        </div>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 h-[600px]">
          {/* Theme Info Sidebar */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">About This Theme</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{theme.description}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h4>
              <div className="space-y-1">
                {theme.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Color Scheme</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg border border-gray-300 mb-1"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Primary</span>
                </div>
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg border border-gray-300 mb-1"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Secondary</span>
                </div>
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg border border-gray-300 mb-1"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Accent</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Demo Pages</h4>
              <div className="space-y-1">
                {theme.demoPages.map((page, index) => (
                  <button
                    key={page}
                    onClick={() => setActiveDemo(index)}
                    className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                      activeDemo === index
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <HiStar className="w-4 h-4 text-yellow-400" />
                  <span>{theme.rating} rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HiDownload className="w-4 h-4" />
                  <span>{theme.downloads.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={() => onSelect(theme)}
                className="w-full"
                color={theme.isPremium ? "purple" : "blue"}
              >
                {theme.isPremium ? 'Get Premium Theme - $29' : 'Select This Theme'}
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3 bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full overflow-hidden">
              <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="flex-1 bg-white dark:bg-gray-600 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
                  {theme.previewUrl}/{theme.demoPages[activeDemo].toLowerCase()}
                </div>
              </div>
              <div className="h-full">
                <iframe
                  src={`${theme.previewUrl}?page=${theme.demoPages[activeDemo]}`}
                  className="w-full h-full"
                  title={`${theme.name} Preview`}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const ThemeSelector: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [themes, setThemes] = useState<Theme[]>(SAMPLE_THEMES);
  const [loading, setLoading] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThemes = themes.filter(theme => {
    const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleSelectTheme = async (theme: Theme) => {
    setLoading(true);
    try {
      // API call to apply theme
      console.log('Applying theme:', theme.slug);
      // Redirect to page builder or show success message
    } catch (error) {
      console.error('Error applying theme:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Theme</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select a beautiful theme for your online store. You can customize it later in the page builder.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {THEME_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              onPreview={setPreviewTheme}
              onSelect={handleSelectTheme}
            />
          ))}
        </div>
      )}

      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <HiTemplate className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No themes found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Theme Preview Modal */}
      {previewTheme && (
        <ThemePreview
          theme={previewTheme}
          isOpen={!!previewTheme}
          onClose={() => setPreviewTheme(null)}
          onSelect={handleSelectTheme}
        />
      )}
    </div>
  );
};

export default ThemeSelector;