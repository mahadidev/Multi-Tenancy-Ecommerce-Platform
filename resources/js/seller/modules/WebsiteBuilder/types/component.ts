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