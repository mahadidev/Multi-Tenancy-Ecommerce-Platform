import type { ElementorSection, ElementorWidget } from '../elementor/ElementorBuilder';
import { 
  createDefaultSection, 
  createSectionWithLayout, 
  addColumnToSection, 
  removeColumnFromSection, 
  duplicateSection, 
  addWidgetToColumn 
} from '../utils/sectionHelpers';
import type { SectionLayout } from '../elementor/SectionLayoutPanel';
import type { ResponsiveBreakpoint } from '../elementor/ElementorBuilder';

export class ElementorService {
  // Section operations
  static addSection(
    sections: ElementorSection[], 
    afterSectionId?: string
  ): ElementorSection[] {
    const newSection = createDefaultSection();
    const newSections = [...sections];
    
    if (afterSectionId) {
      const index = newSections.findIndex(s => s.id === afterSectionId);
      newSections.splice(index + 1, 0, newSection);
    } else {
      newSections.push(newSection);
    }
    
    return newSections;
  }

  static addSectionWithLayout(
    sections: ElementorSection[],
    layout: SectionLayout,
    afterSectionId?: string
  ): ElementorSection[] {
    const newSection = createSectionWithLayout(layout);
    const newSections = [...sections];
    
    if (afterSectionId) {
      const index = newSections.findIndex(s => s.id === afterSectionId);
      newSections.splice(index + 1, 0, newSection);
    } else {
      newSections.push(newSection);
    }
    
    return newSections;
  }

  static deleteSection(sections: ElementorSection[], sectionId: string): ElementorSection[] {
    return sections.filter(s => s.id !== sectionId);
  }

  static duplicateSection(sections: ElementorSection[], sectionId: string): ElementorSection[] {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return sections;

    const duplicatedSection = duplicateSection(section);
    const index = sections.findIndex(s => s.id === sectionId);
    const newSections = [...sections];
    newSections.splice(index + 1, 0, duplicatedSection);
    
    return newSections;
  }

  static clearSection(sections: ElementorSection[], sectionId: string): ElementorSection[] {
    return sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            columns: section.columns.map(column => ({
              ...column,
              widgets: []
            }))
          }
        : section
    );
  }

  // Column operations
  static addColumn(
    sections: ElementorSection[], 
    sectionId: string,
    devicePreview: ResponsiveBreakpoint
  ): ElementorSection[] {
    return addColumnToSection(sections, sectionId, devicePreview);
  }

  static removeColumn(
    sections: ElementorSection[], 
    sectionId: string, 
    columnId: string,
    devicePreview: ResponsiveBreakpoint
  ): ElementorSection[] {
    return removeColumnFromSection(sections, sectionId, columnId, devicePreview);
  }

  // Widget operations
  static addWidget(
    sections: ElementorSection[],
    columnId: string,
    widget: Omit<ElementorWidget, 'id'>,
    position?: number
  ): ElementorSection[] {
    return addWidgetToColumn(sections, columnId, widget, position);
  }

  static deleteWidget(sections: ElementorSection[], widgetId: string): ElementorSection[] {
    return sections.map(section => ({
      ...section,
      columns: section.columns.map(column => ({
        ...column,
        widgets: column.widgets.filter(widget => widget.id !== widgetId)
      }))
    }));
  }

  // Settings updates
  static updateSectionSettings(
    sections: ElementorSection[], 
    sectionId: string, 
    settings: any
  ): ElementorSection[] {
    return sections.map(section => 
      section.id === sectionId 
        ? { ...section, settings: settings }
        : section
    );
  }

  static updateColumnSettings(
    sections: ElementorSection[], 
    columnId: string, 
    settings: any
  ): ElementorSection[] {
    return sections.map(section => ({
      ...section,
      columns: section.columns.map(column =>
        column.id === columnId
          ? { ...column, settings: settings }
          : column
      )
    }));
  }

  static updateWidgetSettings(
    sections: ElementorSection[], 
    widgetId: string, 
    settings: any
  ): ElementorSection[] {
    return sections.map(section => ({
      ...section,
      columns: section.columns.map(column => ({
        ...column,
        widgets: column.widgets.map(widget =>
          widget.id === widgetId
            ? { ...widget, ...settings }
            : widget
        )
      }))
    }));
  }

  // Utility methods
  static clearAllSections(): ElementorSection[] {
    return [];
  }

  static findWidget(sections: ElementorSection[], widgetId: string): ElementorWidget | null {
    for (const section of sections) {
      for (const column of section.columns) {
        const widget = column.widgets.find(w => w.id === widgetId);
        if (widget) return widget;
      }
    }
    return null;
  }

  static findColumn(sections: ElementorSection[], columnId: string): any | null {
    for (const section of sections) {
      const column = section.columns.find(c => c.id === columnId);
      if (column) return column;
    }
    return null;
  }

  static findSection(sections: ElementorSection[], sectionId: string): ElementorSection | null {
    return sections.find(s => s.id === sectionId) || null;
  }
}