// Section component prop types

export interface SectionProps {
  className?: string;
}

export interface HeroSectionProps extends SectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButton?: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  overlayOpacity?: number;
}

export interface ProductGridProps extends SectionProps {
  title?: string;
  showFilters?: boolean;
  showSorting?: boolean;
  showSearch?: boolean;
  columns?: 2 | 3 | 4;
  initialLimit?: number;
}

export interface FeaturedProductsProps extends SectionProps {
  title?: string;
  subtitle?: string;
  productSource?: {
    type: 'static' | 'dynamic';
    products?: string[];
    query?: string;
    limit?: number;
  };
  columns?: 2 | 3 | 4 | 5;
  showViewAll?: boolean;
  viewAllLink?: string;
}