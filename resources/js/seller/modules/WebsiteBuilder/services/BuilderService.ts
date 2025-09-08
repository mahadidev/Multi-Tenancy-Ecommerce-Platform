import type { ElementorSection } from '../elementor/ElementorBuilder';

export interface SavePageData {
  pageId: number;
  sections: ElementorSection[];
  deviceSettings: {
    desktop: Record<string, any>;
    tablet: Record<string, any>;
    mobile: Record<string, any>;
  };
}

export interface SaveLayoutData {
  sections: ElementorSection[];
  deviceSettings: {
    desktop: Record<string, any>;
    tablet: Record<string, any>;
    mobile: Record<string, any>;
  };
}

export class BuilderService {
  static async savePage(data: SavePageData): Promise<any> {
    // This would typically call the API
    console.log('💾 Saving page data:', data);
    // Implementation would use the actual API mutation
    throw new Error('Not implemented - use API mutation directly');
  }

  static async saveLayout(data: SaveLayoutData, onSave?: (data: any) => Promise<void>): Promise<void> {
    if (!onSave) {
      throw new Error('No save callback provided for layout saving');
    }
    
    console.log('💾 Saving layout data via callback:', data);
    await onSave(data);
  }

  static validateSections(sections: ElementorSection[]): boolean {
    if (!Array.isArray(sections)) return false;
    
    return sections.every(section => {
      if (!section.id || !Array.isArray(section.columns)) return false;
      
      return section.columns.every(column => {
        if (!column.id || !Array.isArray(column.widgets)) return false;
        
        return column.widgets.every(widget => {
          return widget.id && widget.type;
        });
      });
    });
  }

  static prepareSaveData(sections: ElementorSection[]): ElementorSection[] {
    // Ensure sections is always an array, even when empty
    return Array.isArray(sections) ? sections : [];
  }
}