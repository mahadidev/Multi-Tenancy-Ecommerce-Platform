import { useState } from 'react';

interface Component {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
}

interface ComponentSelectorProps {
  onSelectComponent: (component: Component) => void;
}

const COMPONENT_CATEGORIES = [
  { id: 'layout', name: 'Layout', icon: '⚡' },
  { id: 'content', name: 'Content', icon: '📝' },
  { id: 'media', name: 'Media', icon: '🖼️' },
  { id: 'forms', name: 'Forms', icon: '📋' },
  { id: 'commerce', name: 'Commerce', icon: '🛒' },
  { id: 'navigation', name: 'Navigation', icon: '🧭' },
];

const COMPONENTS: Component[] = [
  // Layout Components
  { id: 'hero-section', name: 'Hero Section', category: 'layout', icon: '🎯', description: 'Large banner with title and CTA' },
  { id: 'hero-banner', name: 'Hero Banner', category: 'layout', icon: '🎨', description: 'Simple banner with image' },
  { id: 'hero-slider', name: 'Hero Slider', category: 'layout', icon: '🎠', description: 'Rotating hero images' },
  { id: 'feature-cards', name: 'Feature Cards', category: 'layout', icon: '🃏', description: 'Grid of feature cards' },
  
  // Content Components
  { id: 'text-block', name: 'Text Block', category: 'content', icon: '📄', description: 'Rich text content' },
  { id: 'image-block', name: 'Image Block', category: 'content', icon: '🖼️', description: 'Single image with caption' },
  { id: 'testimonial-block', name: 'Testimonials', category: 'content', icon: '💬', description: 'Customer testimonials' },
  { id: 'features-list', name: 'Features List', category: 'content', icon: '📋', description: 'List of features' },
  
  // Media Components
  { id: 'video-block', name: 'Video Player', category: 'media', icon: '🎥', description: 'Embedded video player' },
  { id: 'image-gallery', name: 'Image Gallery', category: 'media', icon: '🖼️', description: 'Photo gallery grid' },
  
  // Forms Components
  { id: 'contact-form', name: 'Contact Form', category: 'forms', icon: '📧', description: 'Contact form with fields' },
  { id: 'newsletter-signup', name: 'Newsletter', category: 'forms', icon: '📬', description: 'Email subscription form' },
  { id: 'login-form', name: 'Login Form', category: 'forms', icon: '🔐', description: 'User login form' },
  { id: 'signup-form', name: 'Signup Form', category: 'forms', icon: '✍️', description: 'User registration form' },
  
  // Commerce Components
  { id: 'product-grid', name: 'Product Grid', category: 'commerce', icon: '🛍️', description: 'Grid of products' },
  { id: 'product-carousel', name: 'Product Carousel', category: 'commerce', icon: '🎠', description: 'Sliding products' },
  { id: 'cart-page', name: 'Shopping Cart', category: 'commerce', icon: '🛒', description: 'Shopping cart page' },
  
  // Navigation Components
  { id: 'navigation-bar', name: 'Navigation Bar', category: 'navigation', icon: '🧭', description: 'Site navigation menu' },
  { id: 'breadcrumb', name: 'Breadcrumbs', category: 'navigation', icon: '🗂️', description: 'Breadcrumb navigation' },
  { id: 'button-block', name: 'Button', category: 'navigation', icon: '🔘', description: 'Call-to-action button' },
];

export function ComponentSelector({ onSelectComponent }: ComponentSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('layout');

  const filteredComponents = COMPONENTS.filter(component => 
    component.category === activeCategory
  );

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {COMPONENT_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeCategory === category.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredComponents.map((component) => (
          <button
            key={component.id}
            onClick={() => onSelectComponent(component)}
            className="group p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">{component.icon}</div>
            <div className="text-sm font-medium text-gray-900 mb-1">{component.name}</div>
            <div className="text-xs text-gray-500 line-clamp-2">{component.description}</div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredComponents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📦</div>
          <div className="text-gray-500">No components available in this category</div>
        </div>
      )}
    </div>
  );
}