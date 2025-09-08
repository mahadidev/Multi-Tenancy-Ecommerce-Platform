import type { ElementorSection, ElementorWidget, ResponsiveBreakpoint } from '../elementor/ElementorBuilder';
import type { SectionLayout } from '../elementor/SectionLayoutPanel';
import { updateResponsiveSetting } from './responsive';
import { DEFAULT_SECTION_SETTINGS, DEFAULT_COLUMN_SETTINGS } from '../constants';

export function createDefaultSection(timestamp?: number): ElementorSection {
  const id = timestamp || Date.now();
  return {
    id: `section-${id}`,
    columns: [
      {
        id: `column-${id}-0`,
        widgets: [],
        settings: {
          desktop: DEFAULT_COLUMN_SETTINGS
        }
      }
    ],
    settings: {
      desktop: DEFAULT_SECTION_SETTINGS
    }
  };
}

export function createSectionWithLayout(layout: SectionLayout, timestamp?: number): ElementorSection {
  const id = timestamp || Date.now();
  const columns = layout.columns.map((width, index) => ({
    id: `column-${id}-${index}`,
    widgets: [],
    settings: {
      desktop: {
        ...DEFAULT_COLUMN_SETTINGS,
        width
      }
    }
  }));

  return {
    id: `section-${id}`,
    columns,
    settings: {
      desktop: {
        ...DEFAULT_SECTION_SETTINGS,
        columnsPerRow: layout.columns.length
      }
    }
  };
}

export function addColumnToSection(
  sections: ElementorSection[], 
  sectionId: string,
  devicePreview: ResponsiveBreakpoint
): ElementorSection[] {
  return sections.map(section => {
    if (section.id === sectionId) {
      const newColumn = {
        id: `column-${Date.now()}`,
        widgets: [],
        settings: {
          desktop: DEFAULT_COLUMN_SETTINGS
        }
      };

      const updatedSectionSettings = updateResponsiveSetting(
        section.settings,
        devicePreview,
        {
          columnsPerRow: Array.isArray(section.columns) ? section.columns.length + 1 : 2
        }
      );
      
      const currentColumns = Array.isArray(section.columns) ? section.columns : [];
      return {
        ...section,
        columns: [...currentColumns, newColumn],
        settings: updatedSectionSettings
      };
    }
    return section;
  });
}

export function removeColumnFromSection(
  sections: ElementorSection[], 
  sectionId: string, 
  columnId: string,
  devicePreview: ResponsiveBreakpoint
): ElementorSection[] {
  return sections.map(section => {
    if (section.id === sectionId) {
      const currentColumns = Array.isArray(section.columns) ? section.columns : [];
      const remainingColumns = currentColumns.filter(col => col.id !== columnId);
      
      if (remainingColumns.length === 0) {
        return null;
      }
      
      const updatedSectionSettings = updateResponsiveSetting(
        section.settings,
        devicePreview,
        {
          columnsPerRow: remainingColumns.length
        }
      );
      
      return {
        ...section,
        columns: remainingColumns,
        settings: updatedSectionSettings
      };
    }
    return section;
  }).filter(section => section !== null) as ElementorSection[];
}

export function duplicateSection(section: ElementorSection): ElementorSection {
  const timestamp = Date.now();
  return {
    ...section,
    id: `section-${timestamp}`,
    columns: section.columns.map(col => ({
      ...col,
      id: `column-${timestamp}-${Math.random()}`,
      widgets: col.widgets.map(widget => ({
        ...widget,
        id: `widget-${timestamp}-${Math.random()}`
      }))
    }))
  };
}

export function duplicateColumn(column: any, timestamp?: number): any {
  const id = timestamp || Date.now();
  return {
    ...column,
    id: `column-${id}`,
    widgets: Array.isArray(column.widgets) 
      ? column.widgets.map((widget: any, widgetIndex: number) => ({
          ...widget,
          id: `widget-${id}-${widgetIndex}`
        }))
      : []
  };
}

export function addWidgetToColumn(
  sections: ElementorSection[],
  columnId: string,
  widget: Omit<ElementorWidget, 'id'>,
  position?: number
): ElementorSection[] {
  const newWidget: ElementorWidget = {
    ...widget,
    id: `widget-${Date.now()}`
  };

  return sections.map(section => {
    const newColumns = Array.isArray(section.columns) ? section.columns.map(column => {
      if (column.id === columnId) {
        const existingWidgets = Array.isArray(column.widgets) ? column.widgets : [];
        const newWidgets = [...existingWidgets];
        if (position !== undefined) {
          newWidgets.splice(position, 0, newWidget);
        } else {
          newWidgets.push(newWidget);
        }
        return { ...column, widgets: newWidgets };
      }
      return column;
    }) : [];
    
    return {
      ...section,
      columns: newColumns
    };
  });
}