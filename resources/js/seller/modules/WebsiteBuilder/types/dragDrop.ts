import type { ComponentType } from './component';
import type { PageComponent } from './website';

export interface DragItem {
  type: 'COMPONENT_TYPE' | 'PAGE_COMPONENT';
  item: ComponentType | PageComponent;
}

export interface DropResult {
  section_id: number;
  position: number;
}