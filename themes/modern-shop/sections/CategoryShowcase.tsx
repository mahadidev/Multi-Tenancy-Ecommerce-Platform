import React from 'react';
import { Button } from '../components/Button';

interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
  productCount?: number;
}

interface CategoryShowcaseProps {
  title?: string;
  subtitle?: string;
  categories?: Category[];
  layout?: 'grid' | 'carousel';
  className?: string;
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  title = 'Shop by Category',
  subtitle = 'Find exactly what you\'re looking for',
  categories = [
    {
      id: '1',
      name: 'Electronics',
      image: 'https://placehold.co/400x300/1e40af/ffffff?text=Electronics',
      href: '/shop?category=electronics',
      productCount: 45
    },
    {
      id: '2', 
      name: 'Fashion',
      image: 'https://placehold.co/400x300/db2777/ffffff?text=Fashion',
      href: '/shop?category=fashion',
      productCount: 120
    },
    {
      id: '3',
      name: 'Home & Garden',
      image: 'https://placehold.co/400x300/059669/ffffff?text=Home+%26+Garden',
      href: '/shop?category=home',
      productCount: 78
    }
  ],
  layout = 'grid',
  className = ''
}) => {
  return (
    <section className={`section ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
            <span className="modern-text-gradient">{title}</span>
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
              {subtitle}
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group">
              <a href={category.href} className="block">
                <div className="relative overflow-hidden rounded-2xl modern-shadow hover:modern-shadow-lg transition-all duration-300">
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">
                      {category.name}
                    </h3>
                    {category.productCount && (
                      <p className="text-white/80 text-sm mb-4">
                        {category.productCount} products
                      </p>
                    )}
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                    >
                      Shop Now
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Arrow Right Icon
const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default CategoryShowcase;