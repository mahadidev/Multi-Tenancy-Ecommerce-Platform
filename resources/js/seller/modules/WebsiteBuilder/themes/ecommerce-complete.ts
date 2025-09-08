import { ElementorSection } from '../elementor/ElementorBuilder';

export interface EcommerceThemePage {
  id: string;
  title: string;
  slug: string;
  type: 'home' | 'product' | 'collection' | 'cart' | 'checkout' | 'account' | 'about' | 'contact' | 'blog' | 'policy';
  description: string;
  sections: ElementorSection[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  settings?: {
    layout?: 'full-width' | 'boxed';
    headerStyle?: 'default' | 'transparent' | 'sticky';
    footerStyle?: 'default' | 'minimal' | 'extended';
  };
}

export interface EcommerceTheme {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'e-commerce';
  pages: EcommerceThemePage[];
  globalSettings: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
      surface: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    layout: {
      maxWidth: string;
      spacing: string;
    };
  };
  features: string[];
}

// Complete E-commerce Theme
export const completeEcommerceTheme: EcommerceTheme = {
  id: 'complete-ecommerce-v1',
  name: 'Complete E-commerce',
  description: 'A comprehensive e-commerce theme with all essential pages pre-built and ready to customize',
  version: '1.0.0',
  author: 'CG Builder Team',
  category: 'e-commerce',
  features: [
    'Complete E-commerce Pages',
    'Product Management',
    'Shopping Cart',
    'Checkout Process',
    'User Authentication',
    'Blog Integration',
    'SEO Optimized',
    'Mobile Responsive',
    'Elementor Compatible'
  ],
  globalSettings: {
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      text: '#1f2937',
      background: '#ffffff',
      surface: '#f9fafb'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    layout: {
      maxWidth: '1200px',
      spacing: '1rem'
    }
  },
  pages: [
    // HOME PAGE
    {
      id: 'home',
      title: 'Home',
      slug: '',
      type: 'home',
      description: 'Main homepage with hero, featured products, and call-to-actions',
      sections: [
        {
          id: 'hero-section',
          columns: [
            {
              id: 'hero-column',
              width: 100,
              widgets: [
                {
                  id: 'hero-widget',
                  type: 'hero',
                  content: {
                    title: 'Welcome to Our Store',
                    subtitle: 'Discover amazing products at great prices',
                    buttonText: 'Shop Now',
                    buttonLink: '/products',
                    backgroundImage: '/api/placeholder/1920/600',
                    overlay: true
                  },
                  settings: {
                    textAlign: 'center',
                    minHeight: '500px'
                  }
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'full-width',
            backgroundColor: '#f8fafc',
            padding: '0'
          }
        },
        {
          id: 'featured-products',
          columns: [
            {
              id: 'featured-column',
              width: 100,
              widgets: [
                {
                  id: 'featured-heading',
                  type: 'heading',
                  content: {
                    text: 'Featured Products',
                    tag: 'h2'
                  },
                  settings: {
                    textAlign: 'center',
                    marginBottom: '2rem'
                  }
                },
                {
                  id: 'product-grid',
                  type: 'product-grid',
                  content: {
                    limit: 8,
                    columns: 4,
                    showPrice: true,
                    showAddToCart: true,
                    filter: 'featured'
                  },
                  settings: {
                    gap: '1.5rem'
                  }
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '4rem 2rem'
          }
        },
        {
          id: 'categories-section',
          columns: [
            {
              id: 'categories-column',
              width: 100,
              widgets: [
                {
                  id: 'categories-heading',
                  type: 'heading',
                  content: {
                    text: 'Shop by Category',
                    tag: 'h2'
                  },
                  settings: {
                    textAlign: 'center',
                    marginBottom: '2rem'
                  }
                },
                {
                  id: 'category-grid',
                  type: 'category-grid',
                  content: {
                    columns: 3,
                    showTitle: true,
                    showCount: true
                  },
                  settings: {
                    gap: '1.5rem'
                  }
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '4rem 2rem',
            backgroundColor: '#f9fafb'
          }
        }
      ],
      seo: {
        title: 'Home - Your Online Store',
        description: 'Welcome to our online store. Find the best products at competitive prices.',
        keywords: ['ecommerce', 'online store', 'shopping', 'products']
      }
    },
    
    // PRODUCTS/COLLECTION PAGE
    {
      id: 'products',
      title: 'Products',
      slug: 'products',
      type: 'collection',
      description: 'Product listing page with filters and search',
      sections: [
        {
          id: 'products-header',
          columns: [
            {
              id: 'header-column',
              width: 100,
              widgets: [
                {
                  id: 'page-header',
                  type: 'page-header',
                  content: {
                    title: 'All Products',
                    subtitle: 'Browse our complete collection',
                    breadcrumbs: true
                  },
                  settings: {
                    textAlign: 'center',
                    padding: '3rem 0'
                  }
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            backgroundColor: '#f9fafb'
          }
        },
        {
          id: 'products-content',
          columns: [
            {
              id: 'filters-sidebar',
              width: 25,
              widgets: [
                {
                  id: 'product-filters',
                  type: 'product-filters',
                  content: {
                    showCategories: true,
                    showPriceRange: true,
                    showBrands: true,
                    showRatings: true
                  },
                  settings: {}
                }
              ],
              settings: {
                padding: '0 1rem 0 0'
              }
            },
            {
              id: 'products-grid',
              width: 75,
              widgets: [
                {
                  id: 'products-toolbar',
                  type: 'products-toolbar',
                  content: {
                    showSortBy: true,
                    showViewToggle: true,
                    showResultsCount: true
                  },
                  settings: {
                    marginBottom: '1.5rem'
                  }
                },
                {
                  id: 'products-list',
                  type: 'product-grid',
                  content: {
                    columns: 3,
                    showPrice: true,
                    showAddToCart: true,
                    showQuickView: true,
                    pagination: true,
                    perPage: 12
                  },
                  settings: {
                    gap: '1.5rem'
                  }
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '2rem'
          }
        }
      ],
      seo: {
        title: 'Products - Browse Our Collection',
        description: 'Explore our wide range of products. Find exactly what you need.',
        keywords: ['products', 'catalog', 'shop', 'browse']
      }
    },

    // SINGLE PRODUCT PAGE
    {
      id: 'product-single',
      title: 'Product Detail',
      slug: 'product/:slug',
      type: 'product',
      description: 'Single product page with details, images, and purchase options',
      sections: [
        {
          id: 'product-details',
          columns: [
            {
              id: 'product-images',
              width: 50,
              widgets: [
                {
                  id: 'product-gallery',
                  type: 'product-gallery',
                  content: {
                    showThumbnails: true,
                    enableZoom: true,
                    enableLightbox: true
                  },
                  settings: {}
                }
              ],
              settings: {
                padding: '0 1rem 0 0'
              }
            },
            {
              id: 'product-info',
              width: 50,
              widgets: [
                {
                  id: 'product-title',
                  type: 'product-title',
                  content: {},
                  settings: {
                    marginBottom: '1rem'
                  }
                },
                {
                  id: 'product-price',
                  type: 'product-price',
                  content: {
                    showComparePrice: true,
                    showSavings: true
                  },
                  settings: {
                    marginBottom: '1rem'
                  }
                },
                {
                  id: 'product-rating',
                  type: 'product-rating',
                  content: {
                    showReviewCount: true
                  },
                  settings: {
                    marginBottom: '1rem'
                  }
                },
                {
                  id: 'product-description',
                  type: 'product-description',
                  content: {},
                  settings: {
                    marginBottom: '2rem'
                  }
                },
                {
                  id: 'product-options',
                  type: 'product-options',
                  content: {
                    showVariants: true,
                    showQuantity: true
                  },
                  settings: {
                    marginBottom: '2rem'
                  }
                },
                {
                  id: 'add-to-cart',
                  type: 'add-to-cart-button',
                  content: {
                    text: 'Add to Cart',
                    style: 'primary',
                    fullWidth: true
                  },
                  settings: {}
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '3rem 2rem'
          }
        },
        {
          id: 'product-tabs',
          columns: [
            {
              id: 'tabs-column',
              width: 100,
              widgets: [
                {
                  id: 'product-tabs-widget',
                  type: 'product-tabs',
                  content: {
                    tabs: [
                      { id: 'description', title: 'Description', active: true },
                      { id: 'specifications', title: 'Specifications' },
                      { id: 'reviews', title: 'Reviews' }
                    ]
                  },
                  settings: {}
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '0 2rem 3rem'
          }
        },
        {
          id: 'related-products',
          columns: [
            {
              id: 'related-column',
              width: 100,
              widgets: [
                {
                  id: 'related-heading',
                  type: 'heading',
                  content: {
                    text: 'Related Products',
                    tag: 'h3'
                  },
                  settings: {
                    marginBottom: '2rem'
                  }
                },
                {
                  id: 'related-grid',
                  type: 'product-grid',
                  content: {
                    limit: 4,
                    columns: 4,
                    showPrice: true,
                    showAddToCart: true,
                    filter: 'related'
                  },
                  settings: {}
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '3rem 2rem',
            backgroundColor: '#f9fafb'
          }
        }
      ]
    },

    // SHOPPING CART
    {
      id: 'cart',
      title: 'Shopping Cart',
      slug: 'cart',
      type: 'cart',
      description: 'Shopping cart page with item management',
      sections: [
        {
          id: 'cart-header',
          columns: [
            {
              id: 'header-column',
              width: 100,
              widgets: [
                {
                  id: 'cart-header-widget',
                  type: 'page-header',
                  content: {
                    title: 'Shopping Cart',
                    breadcrumbs: true
                  },
                  settings: {
                    textAlign: 'center',
                    padding: '2rem 0'
                  }
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            backgroundColor: '#f9fafb'
          }
        },
        {
          id: 'cart-content',
          columns: [
            {
              id: 'cart-items',
              width: 70,
              widgets: [
                {
                  id: 'cart-table',
                  type: 'cart-table',
                  content: {
                    showImages: true,
                    showQuantity: true,
                    showPrice: true,
                    showTotal: true,
                    allowRemove: true
                  },
                  settings: {}
                }
              ],
              settings: {
                padding: '0 2rem 0 0'
              }
            },
            {
              id: 'cart-summary',
              width: 30,
              widgets: [
                {
                  id: 'cart-totals',
                  type: 'cart-totals',
                  content: {
                    showSubtotal: true,
                    showTax: true,
                    showShipping: true,
                    showTotal: true
                  },
                  settings: {
                    marginBottom: '1.5rem'
                  }
                },
                {
                  id: 'checkout-button',
                  type: 'button',
                  content: {
                    text: 'Proceed to Checkout',
                    link: '/checkout',
                    style: 'primary',
                    fullWidth: true
                  },
                  settings: {}
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '2rem'
          }
        }
      ]
    },

    // CHECKOUT PAGE
    {
      id: 'checkout',
      title: 'Checkout',
      slug: 'checkout',
      type: 'checkout',
      description: 'Secure checkout process',
      sections: [
        {
          id: 'checkout-content',
          columns: [
            {
              id: 'checkout-form',
              width: 60,
              widgets: [
                {
                  id: 'checkout-steps',
                  type: 'checkout-steps',
                  content: {
                    steps: ['Shipping', 'Payment', 'Review']
                  },
                  settings: {
                    marginBottom: '2rem'
                  }
                },
                {
                  id: 'checkout-form-widget',
                  type: 'checkout-form',
                  content: {
                    sections: ['shipping', 'payment']
                  },
                  settings: {}
                }
              ],
              settings: {
                padding: '0 2rem 0 0'
              }
            },
            {
              id: 'order-summary',
              width: 40,
              widgets: [
                {
                  id: 'order-summary-widget',
                  type: 'order-summary',
                  content: {
                    showItems: true,
                    showTotals: true,
                    showCoupon: true
                  },
                  settings: {}
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '3rem 2rem'
          }
        }
      ]
    },

    // ACCOUNT PAGES
    {
      id: 'account',
      title: 'My Account',
      slug: 'account',
      type: 'account',
      description: 'User account dashboard',
      sections: [
        {
          id: 'account-content',
          columns: [
            {
              id: 'account-sidebar',
              width: 25,
              widgets: [
                {
                  id: 'account-menu',
                  type: 'account-menu',
                  content: {
                    items: [
                      { title: 'Dashboard', link: '/account' },
                      { title: 'Orders', link: '/account/orders' },
                      { title: 'Profile', link: '/account/profile' },
                      { title: 'Addresses', link: '/account/addresses' },
                      { title: 'Logout', link: '/logout' }
                    ]
                  },
                  settings: {}
                }
              ],
              settings: {}
            },
            {
              id: 'account-main',
              width: 75,
              widgets: [
                {
                  id: 'account-dashboard',
                  type: 'account-dashboard',
                  content: {
                    showOrders: true,
                    showProfile: true,
                    showAddresses: true
                  },
                  settings: {}
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '3rem 2rem'
          }
        }
      ]
    },

    // ABOUT PAGE
    {
      id: 'about',
      title: 'About Us',
      slug: 'about',
      type: 'about',
      description: 'About us page with company information',
      sections: [
        {
          id: 'about-hero',
          columns: [
            {
              id: 'about-hero-column',
              width: 100,
              widgets: [
                {
                  id: 'about-hero-widget',
                  type: 'hero',
                  content: {
                    title: 'About Our Story',
                    subtitle: 'Learn more about our company and mission',
                    backgroundImage: '/api/placeholder/1920/400'
                  },
                  settings: {
                    textAlign: 'center',
                    minHeight: '300px'
                  }
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'full-width'
          }
        },
        {
          id: 'about-content',
          columns: [
            {
              id: 'about-text',
              width: 60,
              widgets: [
                {
                  id: 'about-heading',
                  type: 'heading',
                  content: {
                    text: 'Our Mission',
                    tag: 'h2'
                  },
                  settings: {
                    marginBottom: '1rem'
                  }
                },
                {
                  id: 'about-text-widget',
                  type: 'text',
                  content: {
                    text: 'We are dedicated to providing high-quality products and exceptional customer service. Our team works tirelessly to bring you the best shopping experience possible.'
                  },
                  settings: {}
                }
              ],
              settings: {
                padding: '0 2rem 0 0'
              }
            },
            {
              id: 'about-image',
              width: 40,
              widgets: [
                {
                  id: 'about-image-widget',
                  type: 'image',
                  content: {
                    src: '/api/placeholder/400/300',
                    alt: 'Our team'
                  },
                  settings: {}
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '4rem 2rem'
          }
        }
      ]
    },

    // CONTACT PAGE
    {
      id: 'contact',
      title: 'Contact Us',
      slug: 'contact',
      type: 'contact',
      description: 'Contact form and information',
      sections: [
        {
          id: 'contact-content',
          columns: [
            {
              id: 'contact-form-column',
              width: 60,
              widgets: [
                {
                  id: 'contact-heading',
                  type: 'heading',
                  content: {
                    text: 'Get in Touch',
                    tag: 'h2'
                  },
                  settings: {
                    marginBottom: '2rem'
                  }
                },
                {
                  id: 'contact-form',
                  type: 'contact-form',
                  content: {
                    fields: ['name', 'email', 'subject', 'message'],
                    submitText: 'Send Message'
                  },
                  settings: {}
                }
              ],
              settings: {
                padding: '0 2rem 0 0'
              }
            },
            {
              id: 'contact-info-column',
              width: 40,
              widgets: [
                {
                  id: 'contact-info',
                  type: 'contact-info',
                  content: {
                    showAddress: true,
                    showPhone: true,
                    showEmail: true,
                    showHours: true
                  },
                  settings: {}
                }
              ],
              settings: {}
            }
          ],
          settings: {
            layout: 'boxed',
            contentWidth: '1200px',
            padding: '4rem 2rem'
          }
        }
      ]
    }
  ]
};