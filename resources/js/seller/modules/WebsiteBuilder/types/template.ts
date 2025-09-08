import type { ComponentType } from './component';

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