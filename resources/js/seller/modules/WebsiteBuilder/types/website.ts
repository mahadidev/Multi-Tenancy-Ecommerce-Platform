import type { WebsiteTemplate } from './template';

export interface StoreWebsite {
  id: number;
  store_id: number;
  template_id?: number;
  domain?: string;
  subdomain: string;
  title: string;
  description?: string;
  favicon?: string;
  seo_meta?: Record<string, any>;
  global_styles?: Record<string, any>;
  analytics_settings?: Record<string, any>;
  is_published: boolean;
  published_at?: string;
  is_maintenance_mode: boolean;
  maintenance_message?: string;
  meta_data?: Record<string, any>;
  template?: WebsiteTemplate;
  pages?: WebsitePage[];
  full_domain?: string;
}

export interface WebsitePage {
  id: number;
  website_id: number;
  title: string;
  slug: string;
  description?: string;
  type: string;
  access_level?: 'all' | 'guest' | 'user';
  seo_meta?: Record<string, any>;
  is_published: boolean;
  is_homepage: boolean;
  sort_order: number;
  meta_data?: Record<string, any>;
  sections?: PageSection[];
  full_url?: string;
}

export interface PageSection {
  id: number;
  page_id: number;
  name?: string;
  type: string;
  container_styles?: Record<string, any>;
  sort_order: number;
  is_visible: boolean;
  responsive_settings?: Record<string, any>;
  meta_data?: Record<string, any>;
  components?: PageComponent[];
}

export interface PageComponent {
  id: number;
  section_id: number;
  component_type_id: number;
  name?: string;
  props?: Record<string, any>;
  styles?: Record<string, any>;
  sort_order: number;
  is_visible: boolean;
  responsive_settings?: Record<string, any>;
  animation_settings?: Record<string, any>;
  meta_data?: Record<string, any>;
  component_type?: import('./component').ComponentType;
}