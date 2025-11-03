export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  favicon?: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  settings: {
    currency: string;
    timezone: string;
    language: string;
    taxRate: number;
    shippingPolicy?: string;
    returnPolicy?: string;
    privacyPolicy?: string;
    termsOfService?: string;
  };
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | number;
  children?: Category[];
  productCount?: number;
}

export interface Brand {
  id: string | number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
}

export interface Menu {
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  label: string;
  href: string;
  target?: '_blank' | '_self';
  children?: MenuItem[];
}