export interface Website {
  id: number;
  title: string;
  description?: string;
  subdomain: string;
  domain?: string;
  full_domain: string;
  favicon?: string;
  seo_meta?: Record<string, any>;
  global_styles?: Record<string, any>;
  analytics_settings?: Record<string, any>;
  header_data?: any | null;
  footer_data?: any | null;
  store: StoreInfo;
  menus: WebsiteMenu[];
}

export interface StoreInfo {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  contact_info?: Record<string, any>;
}

export interface WebsiteMenu {
  id: number;
  name: string;
  location: string;
  items: MenuItem[];
  styles?: Record<string, any>;
}

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  type: 'page' | 'product' | 'category' | 'external' | 'custom';
  target?: '_blank' | '_self';
  page_slug?: string;
  product_slug?: string;
  category_slug?: string;
  is_active?: boolean;
  visibility?: 'all' | 'logged_in' | 'guest';
  children?: MenuItem[];
}

export interface WebsitePage {
  id: number;
  title: string;
  slug: string;
  description?: string;
  type: string;
  access_level?: 'all' | 'guest' | 'user';
  seo_meta?: Record<string, any>;
  sections: PageSection[];
}

export interface PageSection {
  id: number;
  name?: string;
  type: string;
  container_styles?: Record<string, any>;
  sort_order: number;
  is_visible?: boolean;
  responsive_settings?: Record<string, any>;
  components: PageComponent[];
}

export interface PageComponent {
  id: number;
  name?: string;
  component_type?: ComponentType;
  props?: Record<string, any>;
  styles?: Record<string, any>;
  sort_order: number;
  is_visible?: boolean;
  responsive_settings?: Record<string, any>;
  animation_settings?: Record<string, any>;
}

export interface ComponentType {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  default_props?: Record<string, any>;
  schema?: Record<string, any>;
  template?: string;
  styles?: Record<string, any>;
  category: ComponentCategory;
}

export interface ComponentCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  thumbnail?: string;
  images: string[];
  slug: string;
  category?: ProductCategory;
  brand?: ProductBrand;
  stock_quantity: number;
  is_active: boolean;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export interface ProductBrand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

export interface FormField {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface WebsiteForm {
  id: number;
  name: string;
  type: string;
  fields: FormField[];
  settings?: Record<string, any>;
}