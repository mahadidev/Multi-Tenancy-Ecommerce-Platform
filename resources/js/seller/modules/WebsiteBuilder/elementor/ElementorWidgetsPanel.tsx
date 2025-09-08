import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

interface WidgetType {
  id: string;
  name: string;
  icon: JSX.Element;
  category: string;
  defaultContent?: any;
  defaultSettings?: any;
}

interface ElementorWidgetsPanelProps {
  onClose: () => void;
  onAddWidget: (columnId: string, widget: any, position?: number) => void;
  selectedColumnId?: string;
}

const DraggableWidget = ({ widget }: { widget: WidgetType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'widget',
    item: { 
      type: 'widget',
      widgetType: widget.id,
      content: widget.defaultContent || {},
      settings: widget.defaultSettings || {}
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Render actual widget preview
  const renderWidgetPreview = () => {
    switch (widget.id) {
      case 'heading':
        return (
          <div className="w-full">
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {widget.defaultContent?.text || 'Heading'}
            </h3>
          </div>
        );
      
      case 'text-editor':
        return (
          <div className="w-full">
            <p className="text-xs text-gray-600 line-clamp-2">
              {widget.defaultContent?.text || 'Lorem ipsum dolor sit amet...'}
            </p>
          </div>
        );
      
      case 'button':
        return (
          <div className="w-full flex justify-center">
            <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
              {widget.defaultContent?.text || 'Click here'}
            </button>
          </div>
        );
      
      case 'image':
        return (
          <div className="w-full">
            <div className="w-full h-12 bg-gray-200 rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="w-full">
            <div className="w-full h-12 bg-black rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        );
      
      case 'spacer':
        return (
          <div className="w-full">
            <div className="w-full h-8 border-t-2 border-b-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-400">Spacer</span>
            </div>
          </div>
        );
      
      case 'icon':
        return (
          <div className="w-full flex justify-center">
            <span className="text-2xl">⭐</span>
          </div>
        );
      
      case 'icon-box':
        return (
          <div className="w-full">
            <div className="text-center">
              <span className="text-xl">📦</span>
              <p className="text-xs font-semibold text-gray-700 mt-1">Icon Box</p>
            </div>
          </div>
        );
      
      case 'star-rating':
        return (
          <div className="w-full flex justify-center">
            <div className="flex space-x-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-xs text-yellow-400">★</span>
              ))}
            </div>
          </div>
        );
      
      case 'image-box':
        return (
          <div className="w-full">
            <div className="bg-gray-100 rounded p-2">
              <div className="w-full h-8 bg-gray-200 rounded mb-1"></div>
              <p className="text-xs font-semibold text-gray-700 truncate">Image Box</p>
            </div>
          </div>
        );
      
      case 'counter':
        return (
          <div className="w-full text-center">
            <div className="text-lg font-bold text-blue-500">100</div>
            <p className="text-xs text-gray-600">Counter</p>
          </div>
        );
      
      case 'progress':
        return (
          <div className="w-full">
            <p className="text-xs text-gray-600 mb-1">Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        );
      
      case 'posts':
        return (
          <div className="w-full">
            <div className="grid grid-cols-2 gap-1">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
            <p className="text-xs text-gray-600 mt-1 text-center">Posts Grid</p>
          </div>
        );
      
      case 'portfolio':
        return (
          <div className="w-full">
            <div className="grid grid-cols-3 gap-0.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1 text-center">Portfolio</p>
          </div>
        );
      
      case 'testimonials':
        return (
          <div className="w-full">
            <div className="bg-gray-100 rounded p-2">
              <div className="flex items-center space-x-1 mb-1">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        );
      
      case 'contact-form':
        return (
          <div className="w-full">
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <button className="w-full py-1 bg-blue-500 text-white text-xs rounded">Send</button>
            </div>
          </div>
        );
      
      case 'site-logo':
        return (
          <div className="w-full">
            <div className="text-lg font-bold text-gray-800">
              {widget.defaultContent?.text || 'Logo'}
            </div>
          </div>
        );
      
      case 'nav-menu':
        return (
          <div className="w-full">
            <div className="flex justify-center space-x-2">
              {['Home', 'About', 'Contact'].map((item, i) => (
                <span key={i} className="text-xs text-gray-600">{item}</span>
              ))}
            </div>
          </div>
        );
      
      case 'search-form':
        return (
          <div className="w-full">
            <div className="flex">
              <div className="flex-1 h-6 bg-gray-200 rounded-l"></div>
              <div className="w-6 h-6 bg-blue-500 rounded-r flex items-center justify-center">
                <span className="text-white text-xs">🔍</span>
              </div>
            </div>
          </div>
        );
      
      case 'social-icons':
        return (
          <div className="w-full">
            <div className="flex justify-center space-x-1">
              {['f', 't', 'i', 'l'].map((icon, i) => (
                <div key={i} className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{icon}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'footer-links':
        return (
          <div className="w-full">
            <div className="space-y-1">
              <div className="h-3 bg-gray-400 rounded w-3/4"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded w-5/6"></div>
              <div className="h-2 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        );
      
      case 'copyright':
        return (
          <div className="w-full">
            <p className="text-xs text-gray-600 text-center">
              © 2024 Company
            </p>
          </div>
        );
      
      case 'newsletter':
        return (
          <div className="w-full">
            <div className="space-y-1">
              <div className="h-3 bg-gray-400 rounded"></div>
              <div className="flex">
                <div className="flex-1 h-5 bg-gray-200 rounded-l"></div>
                <div className="px-2 h-5 bg-blue-500 rounded-r flex items-center">
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'cart-icon':
        return (
          <div className="w-full flex justify-center">
            <div className="relative">
              <span className="text-lg">🛒</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">0</span>
            </div>
          </div>
        );
      
      case 'user-account':
        return (
          <div className="w-full flex justify-center">
            <div className="flex items-center space-x-1">
              <span className="text-lg">👤</span>
              <span className="text-xs text-gray-600">Account</span>
            </div>
          </div>
        );
      
      case 'language-switcher':
        return (
          <div className="w-full">
            <div className="flex items-center justify-center space-x-1">
              <span>🌐</span>
              <span className="text-xs text-gray-600">EN ▼</span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="w-full text-center">
            <div className="text-blue-500 mb-1 text-lg">
              {widget.icon}
            </div>
            <span className="text-xs text-gray-600">{widget.name}</span>
          </div>
        );
    }
  };

  return (
    <div
      ref={drag}
      className={`p-3 bg-white rounded border border-gray-200 cursor-move hover:shadow-sm hover:border-gray-300 transition-all duration-200 group ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <div className="text-blue-500 mb-2 text-lg">
          {widget.icon}
        </div>
        <span className="text-xs text-gray-600">{widget.name}</span>
      </div>
    </div>
  );
};

const widgetCategories = [
  {
    name: 'Basic',
    widgets: [
      {
        id: 'heading',
        name: 'Heading',
        icon: <i className="eicon-editor-h1">H</i>,
        category: 'basic',
        defaultContent: { text: 'Add Your Heading Text Here', tag: 'h2' },
        defaultSettings: { color: '#000000', fontSize: '36px' }
      },
      {
        id: 'text-editor',
        name: 'Text Editor',
        icon: <i className="eicon-text">T</i>,
        category: 'basic',
        defaultContent: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        defaultSettings: { color: '#666666', fontSize: '16px' }
      },
      {
        id: 'image',
        name: 'Image',
        icon: <i className="eicon-image">📷</i>,
        category: 'basic',
        defaultContent: { src: '', alt: 'Image' },
        defaultSettings: { width: '100%', alignment: 'center' }
      },
      {
        id: 'video',
        name: 'Video',
        icon: <i className="eicon-youtube">🎥</i>,
        category: 'basic',
        defaultContent: { url: '', type: 'youtube' },
        defaultSettings: { width: '100%', aspectRatio: '16:9' }
      },
      {
        id: 'button',
        name: 'Button',
        icon: <i className="eicon-button">🔘</i>,
        category: 'basic',
        defaultContent: { text: 'Click here', link: '#' },
        defaultSettings: { backgroundColor: '#61ce70', textColor: '#ffffff' }
      },
      {
        id: 'spacer',
        name: 'Spacer',
        icon: <i className="eicon-spacer">⚏</i>,
        category: 'basic',
        defaultContent: {},
        defaultSettings: { height: '50px' }
      }
    ]
  },
  {
    name: 'Pro',
    widgets: [
      {
        id: 'posts',
        name: 'Posts',
        icon: <i className="eicon-posts-grid">📄</i>,
        category: 'pro',
        defaultContent: { postsPerPage: 6, showExcerpt: true },
        defaultSettings: { columns: 3, gap: '20px' }
      },
      {
        id: 'portfolio',
        name: 'Portfolio',
        icon: <i className="eicon-gallery-grid">🎨</i>,
        category: 'pro',
        defaultContent: { showFilter: true, columns: 3 },
        defaultSettings: { hoverEffect: 'zoom' }
      },
      {
        id: 'testimonials',
        name: 'Testimonials',
        icon: <i className="eicon-testimonial">💬</i>,
        category: 'pro',
        defaultContent: { autoplay: true, showDots: true },
        defaultSettings: { slidesToShow: 1 }
      },
      {
        id: 'contact-form',
        name: 'Contact Form',
        icon: <i className="eicon-form-horizontal">📝</i>,
        category: 'pro',
        defaultContent: { fields: ['name', 'email', 'message'] },
        defaultSettings: { submitText: 'Send Message' }
      }
    ]
  },
  {
    name: 'General',
    widgets: [
      {
        id: 'icon',
        name: 'Icon',
        icon: <i className="eicon-star">⭐</i>,
        category: 'general',
        defaultContent: { icon: 'star', link: '' },
        defaultSettings: { size: '50px', color: '#6ec1e4' }
      },
      {
        id: 'icon-box',
        name: 'Icon Box',
        icon: <i className="eicon-icon-box">📦</i>,
        category: 'general',
        defaultContent: { 
          icon: 'star', 
          title: 'This is the heading',
          description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor'
        },
        defaultSettings: { iconPosition: 'top' }
      },
      {
        id: 'star-rating',
        name: 'Star Rating',
        icon: <i className="eicon-rating">⭐</i>,
        category: 'general',
        defaultContent: { rating: 5, scale: 5 },
        defaultSettings: { starColor: '#ccd6df', markedColor: '#f0ad4e' }
      },
      {
        id: 'image-box',
        name: 'Image Box',
        icon: <i className="eicon-image-box">🖼️</i>,
        category: 'general',
        defaultContent: {
          image: '',
          title: 'This is the heading',
          description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor'
        },
        defaultSettings: { imagePosition: 'top' }
      },
      {
        id: 'counter',
        name: 'Counter',
        icon: <i className="eicon-counter">🔢</i>,
        category: 'general',
        defaultContent: { 
          endingNumber: 100,
          title: 'Counter',
          prefix: '',
          suffix: ''
        },
        defaultSettings: { duration: 2000 }
      },
      {
        id: 'progress',
        name: 'Progress Bar',
        icon: <i className="eicon-skill-bar">📊</i>,
        category: 'general',
        defaultContent: {
          title: 'My Skill',
          percentage: 80
        },
        defaultSettings: { color: '#61ce70' }
      }
    ]
  },
  {
    name: 'Header & Footer',
    widgets: [
      {
        id: 'site-logo',
        name: 'Site Logo',
        icon: <i className="eicon-site-logo">🏢</i>,
        category: 'header-footer',
        defaultContent: { 
          logoType: 'text',
          text: 'Your Logo',
          image: '',
          link: '/'
        },
        defaultSettings: { 
          width: 'auto',
          maxWidth: '200px',
          alignment: 'left'
        }
      },
      {
        id: 'nav-menu',
        name: 'Navigation Menu',
        icon: <i className="eicon-nav-menu">☰</i>,
        category: 'header-footer',
        defaultContent: { 
          items: [
            { label: 'Home', url: '/', active: true },
            { label: 'About', url: '/about' },
            { label: 'Services', url: '/services' },
            { label: 'Contact', url: '/contact' }
          ],
          mobileBreakpoint: 768
        },
        defaultSettings: { 
          layout: 'horizontal',
          alignment: 'center',
          gap: '30px',
          textColor: '#333333',
          hoverColor: '#0073aa'
        }
      },
      {
        id: 'search-form',
        name: 'Search Form',
        icon: <i className="eicon-search">🔍</i>,
        category: 'header-footer',
        defaultContent: { 
          placeholder: 'Search...',
          buttonText: 'Search',
          showButton: true
        },
        defaultSettings: { 
          width: '300px',
          buttonPosition: 'right'
        }
      },
      {
        id: 'social-icons',
        name: 'Social Icons',
        icon: <i className="eicon-social-icons">👥</i>,
        category: 'header-footer',
        defaultContent: { 
          icons: [
            { platform: 'facebook', url: '#' },
            { platform: 'twitter', url: '#' },
            { platform: 'instagram', url: '#' },
            { platform: 'linkedin', url: '#' }
          ]
        },
        defaultSettings: { 
          shape: 'circle',
          size: '20px',
          gap: '10px',
          colorType: 'official'
        }
      },
      {
        id: 'footer-links',
        name: 'Footer Links',
        icon: <i className="eicon-footer-links">🔗</i>,
        category: 'header-footer',
        defaultContent: { 
          title: 'Quick Links',
          links: [
            { label: 'Privacy Policy', url: '/privacy' },
            { label: 'Terms of Service', url: '/terms' },
            { label: 'FAQ', url: '/faq' },
            { label: 'Support', url: '/support' }
          ]
        },
        defaultSettings: { 
          titleColor: '#ffffff',
          linkColor: '#cccccc',
          hoverColor: '#ffffff'
        }
      },
      {
        id: 'copyright',
        name: 'Copyright',
        icon: <i className="eicon-copyright">©</i>,
        category: 'header-footer',
        defaultContent: { 
          text: '© 2024 Your Company. All rights reserved.',
          showYear: true,
          companyName: 'Your Company'
        },
        defaultSettings: { 
          alignment: 'center',
          textColor: '#999999'
        }
      },
      {
        id: 'newsletter',
        name: 'Newsletter',
        icon: <i className="eicon-envelope">✉️</i>,
        category: 'header-footer',
        defaultContent: { 
          title: 'Subscribe to our Newsletter',
          description: 'Get the latest updates and offers.',
          placeholder: 'Enter your email',
          buttonText: 'Subscribe'
        },
        defaultSettings: { 
          layout: 'horizontal',
          buttonColor: '#0073aa'
        }
      },
      {
        id: 'cart-icon',
        name: 'Cart Icon',
        icon: <i className="eicon-cart">🛒</i>,
        category: 'header-footer',
        defaultContent: { 
          showCount: true,
          count: 0,
          link: '/cart'
        },
        defaultSettings: { 
          iconSize: '24px',
          countPosition: 'top-right',
          countColor: '#ff0000'
        }
      },
      {
        id: 'user-account',
        name: 'User Account',
        icon: <i className="eicon-user">👤</i>,
        category: 'header-footer',
        defaultContent: { 
          loggedOutText: 'Login / Register',
          loggedInText: 'My Account',
          showAvatar: true
        },
        defaultSettings: { 
          iconSize: '20px',
          textColor: '#333333'
        }
      },
      {
        id: 'language-switcher',
        name: 'Language Switcher',
        icon: <i className="eicon-globe">🌐</i>,
        category: 'header-footer',
        defaultContent: { 
          languages: [
            { code: 'en', label: 'English', flag: '🇺🇸' },
            { code: 'es', label: 'Español', flag: '🇪🇸' },
            { code: 'fr', label: 'Français', flag: '🇫🇷' }
          ],
          currentLanguage: 'en'
        },
        defaultSettings: { 
          showFlags: true,
          dropdownPosition: 'bottom'
        }
      }
    ]
  }
];

export function ElementorWidgetsPanel({ onClose, onAddWidget, selectedColumnId }: ElementorWidgetsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  // Filter widgets based on search across all categories
  const getFilteredWidgetsForCategory = (category: typeof widgetCategories[0]) => {
    if (!searchTerm) return category.widgets;
    return category.widgets.filter(widget =>
      widget.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Toggle category collapse state
  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900">Elements</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400 bg-gray-50 focus:bg-white transition-colors"
          />
          <svg 
            className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* All Categories with Widgets */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {widgetCategories.map((category, categoryIndex) => {
          const filteredWidgets = getFilteredWidgetsForCategory(category);
          const isCollapsed = collapsedCategories.includes(category.name);
          
          // Skip category if no widgets match search
          if (searchTerm && filteredWidgets.length === 0) return null;
          
          return (
            <div key={category.name} className={categoryIndex > 0 ? 'border-t border-gray-200' : ''}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white hover:bg-gray-50 transition-colors sticky top-0 z-10 border-b border-gray-100"
              >
                <div className="flex items-center">
                  <svg 
                    className={`w-3 h-3 text-gray-400 mr-2 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {category.name}
                  </h3>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {filteredWidgets.length}
                </span>
              </button>
              
              {/* Category Widgets */}
              {!isCollapsed && (
                <div className="p-3 bg-white">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredWidgets.map((widget) => (
                      <DraggableWidget key={widget.id} widget={widget} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* No results message */}
        {searchTerm && widgetCategories.every(cat => getFilteredWidgetsForCategory(cat).length === 0) && (
          <div className="text-center text-gray-500 py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No widgets found</p>
            <p className="text-xs text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Footer Help */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Drag widgets to add them to your page
        </p>
      </div>
    </div>
  );
}