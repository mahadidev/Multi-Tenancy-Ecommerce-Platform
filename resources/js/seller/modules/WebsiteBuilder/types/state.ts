import type { ComponentCategory, ComponentType } from './component';
import type { WebsiteTemplate } from './template';
import type { StoreWebsite, WebsitePage, PageComponent } from './website';
import type { DragItem } from './dragDrop';

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