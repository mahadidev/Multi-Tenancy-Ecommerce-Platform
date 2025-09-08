import type { ElementorSection, ElementorWidget } from '../elementor/ElementorBuilder';
import type { PageSection, ComponentType } from '../types';

export function convertToElementorSections(
  sections: PageSection[],
  pageData?: any
): ElementorSection[] {
  // If page data contains elementor_data, use that instead
  if (pageData?.elementor_data?.sections) {
    console.log('🔄 Loading from saved Elementor data:', pageData.elementor_data.sections.length, 'sections');
    return pageData.elementor_data.sections;
  }
  
  // Otherwise, convert from traditional sections
  const converted: ElementorSection[] = sections.map((section) => ({
    id: `section-${section.id}`,
    columns: [
      {
        id: `column-${section.id}-1`,
        widgets: (section.components || []).map((component): ElementorWidget => ({
          id: `widget-${component.id}`,
          type: component.component_type?.name || 'text',
          content: component.props || {},
          settings: component.styles || {},
        })),
        settings: {
          desktop: {
            width: 100,
            padding: '20px',
            backgroundColor: 'transparent'
          }
        },
      },
    ],
    settings: {
      desktop: {
        layout: 'boxed',
        contentWidth: '1140px',
        backgroundColor: 'transparent',
        padding: '60px 20px',
        margin: '0',
        columnsPerRow: 1,
        columnGap: '1rem',
        rowGap: '1rem',
        alignItems: 'stretch'
      }
    },
  }));
  
  console.log('🔄 Converting from traditional sections:', converted.length, 'sections');
  return converted;
}

export function convertLayoutData(layoutData: any, layoutMode: 'header' | 'footer'): ElementorSection[] {
  let convertedSections: any[] = [];
  
  if (layoutMode === 'header' && layoutData.elements) {
    // Header uses elements format
    convertedSections = layoutData.elements.map((element: any) => ({
      id: element.id,
      columns: Array.isArray(element.columns) ? element.columns.map((column: any) => ({
        id: column.id,
        widgets: Array.isArray(column.widgets) ? column.widgets : [],
        settings: column.settings || {}
      })) : [],
      settings: element.settings || {}
    }));
  } else if (layoutMode === 'footer') {
    // Footer supports both 'rows' (multi-row) and 'columns' (legacy single row) formats
    if (layoutData.rows && layoutData.rows.length > 0) {
      // New multi-row format - convert rows to sections
      convertedSections = layoutData.rows.map((row: any, rowIndex: number) => ({
        id: row.id || `footer-section-${rowIndex + 1}`,
        name: row.name || `Footer Row ${rowIndex + 1}`,
        columns: (row.columns || []).map((column: any, columnIndex: number) => ({
          id: column.id || `row-${rowIndex + 1}-col-${columnIndex + 1}`,
          widgets: column.elements || [],
          settings: {
            desktop: {
              alignment: column.alignment || 'left',
              justifyContent: column.justifyContent || 'start',
              alignItems: column.alignItems || 'start',
              flexDirection: column.flexDirection || 'column',
              gap: column.gap || 'md',
              _columnTitle: column.title || `Column ${columnIndex + 1}`
            }
          }
        })),
        settings: {
          desktop: row.settings || {}
        }
      }));
    } else if (layoutData.columns) {
      // Legacy single-row format - convert to single section with columns
      convertedSections = [{
        id: 'footer-section-1',
        columns: layoutData.columns.map((column: any, index: number) => ({
          id: column.id || `footer-col-${index + 1}`,
          widgets: column.elements || [],
          settings: {
            desktop: {
              alignment: column.alignment || 'left',
              justifyContent: column.justifyContent || 'start',
              alignItems: column.alignItems || 'start',
              flexDirection: column.flexDirection || 'column',
              gap: column.gap || 'md',
              _columnTitle: column.title || `Column ${index + 1}`
            }
          }
        })),
        settings: {
          desktop: layoutData.settings || {}
        }
      }];
    }
  }
  
  return convertedSections;
}