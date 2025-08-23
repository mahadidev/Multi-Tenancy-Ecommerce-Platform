export interface ComponentCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  component_types?: ComponentType[];
}

export interface ComponentType {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  default_props?: Record<string, any>;
  schema?: ComponentSchema;
  template?: string;
  styles?: Record<string, any>;
  is_active: boolean;
  is_premium: boolean;
  sort_order: number;
  meta_data?: Record<string, any>;
  category?: ComponentCategory;
}

export interface ComponentSchema {
  type: string;
  properties?: Record<string, PropertySchema>;
  required?: string[];
}

export interface PropertySchema {
  type: string;
  title?: string;
  description?: string;
  enum?: string[];
  default?: any;
  format?: string;
  minimum?: number;
  maximum?: number;
  items?: PropertySchema;
}

export interface WebsiteTemplate {
  id: number;
  name: string;
  slug: string;
  description?: string;
  preview_image?: string;
  preview_images?: string[];
  category: string;
  is_active: boolean;
  is_premium: boolean;
  price: number;
  sort_order: number;
  meta_data?: Record<string, any>;
  pages?: TemplatePage[];
}

export interface TemplatePage {
  id: number;
  template_id: number;
  title: string;
  slug: string;
  type: string;
  description?: string;
  is_homepage: boolean;
  sort_order: number;
  meta_data?: Record<string, any>;
  sections?: TemplateSection[];
}

export interface TemplateSection {
  id: number;
  template_page_id: number;
  name?: string;
  type: string;
  container_styles?: Record<string, any>;
  sort_order: number;
  meta_data?: Record<string, any>;
  components?: TemplateComponent[];
}

export interface TemplateComponent {
  id: number;
  template_section_id: number;
  component_type_id: number;
  name?: string;
  props?: Record<string, any>;
  styles?: Record<string, any>;
  sort_order: number;
  meta_data?: Record<string, any>;
  component_type?: ComponentType;
}

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
  component_type?: ComponentType;
}

export interface DragItem {
  type: 'COMPONENT_TYPE' | 'PAGE_COMPONENT';
  item: ComponentType | PageComponent;
}

export interface DropResult {
  section_id: number;
  position: number;
}

export interface WebsiteBuilderState {
  // Websites
  websites: StoreWebsite[];
  currentWebsite: StoreWebsite | null;
  websitesLoading: boolean;
  
  // Pages
  pages: WebsitePage[];
  currentPage: WebsitePage | null;
  pagesLoading: boolean;
  
  // Components
  componentCategories: ComponentCategory[];
  componentTypes: ComponentType[];
  componentsLoading: boolean;
  
  // Templates
  templates: WebsiteTemplate[];
  templatesLoading: boolean;
  
  // UI State
  isEditing: boolean;
  selectedComponent: PageComponent | null;
  draggedItem: DragItem | null;
  previewMode: boolean;
  
  // Errors
  error: string | null;
}