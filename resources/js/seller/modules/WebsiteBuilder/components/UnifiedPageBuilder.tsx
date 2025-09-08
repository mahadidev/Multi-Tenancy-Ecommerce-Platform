import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ElementorWidgetsPanel } from '../elementor/ElementorWidgetsPanel';
import { ElementorNavigator } from '../elementor/ElementorNavigator';
import { ElementorSettingsPanel } from '../elementor/ElementorSettingsPanel';
import { ElementorCanvas } from '../elementor/ElementorCanvas';
import { SectionLayoutPanel, type SectionLayout } from '../elementor/SectionLayoutPanel';
import { ThemeSelector } from './ThemeSelector';
import { useGetHeaderQuery, useGetFooterQuery, useSaveElementorPageDataMutation } from '../store/websiteBuilderApi';
import useToast from '@seller/_hooks/useToast';
import type { ComponentType, PageComponent, PageSection } from '../types';
import type { ElementorSection, ElementorWidget, ResponsiveSettings, ResponsiveBreakpoint } from '../elementor/ElementorBuilder';

interface UnifiedPageBuilderProps {
  componentTypes: ComponentType[];
  sections: PageSection[];
  websiteId: number;
  pageId?: number; // Add pageId for API calls
  pageData?: any; // Add pageData to access elementor_data
  layoutMode?: 'header' | 'footer'; // Add layout mode for header/footer building
  onDropComponent: (componentTypeId: number, sectionId: number, position: number) => void;
  onUpdateComponent: (componentId: number, updates: any) => void;
  onDeleteComponent: (componentId: number) => void;
  onSelectComponent: (component: PageComponent) => void;
  selectedComponent?: PageComponent | null;
  onSave?: (data: any) => void;
  onExit?: () => void;
  externalSaving?: boolean; // External saving state for when parent handles the save operation
}

export function UnifiedPageBuilder({
  componentTypes,
  sections,
  websiteId,
  pageId,
  pageData,
  layoutMode,
  onDropComponent,
  onUpdateComponent,
  onDeleteComponent,
  onSelectComponent,
  selectedComponent,
  onSave,
  onExit,
  externalSaving = false,
}: UnifiedPageBuilderProps) {
  const [activePanel, setActivePanel] = useState<'content' | 'style' | 'settings' | 'navigator' | 'widgets' | null>('widgets');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [showSectionLayoutPanel, setShowSectionLayoutPanel] = useState(false);
  const [afterSectionId, setAfterSectionId] = useState<string | undefined>(undefined);
  const [targetSectionForLayout, setTargetSectionForLayout] = useState<string | undefined>(undefined);
  
  // Fetch header and footer data
  const { data: headerData, isLoading: headerLoading } = useGetHeaderQuery(websiteId);
  const { data: footerData, isLoading: footerLoading } = useGetFooterQuery(websiteId);
  
  // Elementor state
  const [elementorSections, setElementorSectionsOriginal] = useState<ElementorSection[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Wrapper function to debug when sections are updated
  const setElementorSections = (newSections: ElementorSection[] | ((prev: ElementorSection[]) => ElementorSection[])) => {
    if (typeof newSections === 'function') {
      console.log('🔄 setElementorSections called with function updater');
      console.trace('Call stack for setElementorSections');
      setElementorSectionsOriginal(newSections);
    } else {
      console.log('🔄 setElementorSections called with:', newSections?.length || 0, 'sections');
      console.trace('Call stack for setElementorSections');
      if (Array.isArray(newSections)) {
        newSections.forEach((section, index) => {
          const columns = Array.isArray(section.columns) ? section.columns : [];
          console.log(`📍 Section ${index}: ${columns.length} columns`, 
            columns.map(col => ({id: col.id, widgets: Array.isArray(col.widgets) ? col.widgets.length : 0})));
        });
      }
      setElementorSectionsOriginal(newSections);
    }
  };
  const [selectedElement, setSelectedElement] = useState<{
    type: 'section' | 'column' | 'widget';
    id: string;
  } | null>(null);

  // Switch to content tab when element is selected
  const handleElementSelect = (element: { type: 'section' | 'column' | 'widget'; id: string } | null) => {
    console.log('🎯 Element selected in UnifiedPageBuilder:', element, 'Layout mode:', layoutMode);
    setSelectedElement(element);
    if (element && activePanel === 'widgets') {
      setActivePanel('content');
    } else if (!element) {
      setActivePanel('widgets');
    }
  };

  // Handle device change from sidebar responsive controls
  const handleSidebarDeviceChange = (breakpoint: ResponsiveBreakpoint) => {
    setDevicePreview(breakpoint);
  };
  const [historyStack, setHistoryStack] = useState<ElementorSection[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize API mutation
  const [saveElementorPageData, { isLoading: internalSaving }] = useSaveElementorPageDataMutation();
  
  // Use external saving state or internal saving state
  const isSaving = externalSaving || internalSaving;
  
  // Initialize toast hook
  const { toaster } = useToast();

  // Utility function to get responsive value based on current device preview
  const getResponsiveValue = <T,>(settings: ResponsiveSettings<T>, fallbackValue: T): T => {
    const device = devicePreview as ResponsiveBreakpoint;
    
    if (device === 'mobile' && settings.mobile) {
      return { ...settings.desktop, ...settings.mobile } as T;
    } else if (device === 'tablet' && settings.tablet) {
      return { ...settings.desktop, ...settings.tablet } as T;
    }
    
    return settings.desktop || fallbackValue;
  };

  // Update responsive setting for specific breakpoint
  const updateResponsiveSetting = <T,>(
    currentSettings: ResponsiveSettings<T>,
    breakpoint: ResponsiveBreakpoint,
    updates: Partial<T>
  ): ResponsiveSettings<T> => {
    if (breakpoint === 'desktop') {
      return {
        ...currentSettings,
        desktop: { ...currentSettings.desktop, ...updates }
      };
    } else {
      const currentBreakpointSettings = currentSettings[breakpoint] || {};
      return {
        ...currentSettings,
        [breakpoint]: { ...currentBreakpointSettings, ...updates }
      };
    }
  };

  // Convert PageSections to ElementorSections for compatibility
  const convertToElementorSections = useCallback((pageData?: any) => {
    // If page data contains elementor_data, use that instead
    if (pageData?.elementor_data?.sections) {
      console.log('🔄 Loading from saved Elementor data:', pageData.elementor_data.sections.length, 'sections');
      setElementorSections(pageData.elementor_data.sections);
      return;
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
    setElementorSections(converted);
  }, [sections]);

  // Helper function to ensure responsive format compatibility
  const ensureResponsiveFormat = <T extends object>(
    settings: any, 
    defaultValues: T
  ): ResponsiveSettings<T> => {
    // If already in responsive format, return as is
    if (settings && settings.desktop) {
      return settings as ResponsiveSettings<T>;
    }
    
    // Convert legacy format to responsive format
    return {
      desktop: { ...defaultValues, ...settings }
    };
  };

  // Initialize elementor sections only on initial mount
  useEffect(() => {
    // Only convert if we haven't initialized yet (initial load only)
    if (!isInitialized) {
      if (layoutMode) {
        // For layout mode, we need to load existing header/footer data
        const layoutData = layoutMode === 'header' ? headerData : footerData;
        const isLayoutLoading = layoutMode === 'header' ? headerLoading : footerLoading;
        
        if (!isLayoutLoading && layoutData?.data) {
          console.log(`🔧 Loading existing ${layoutMode} data:`, layoutData.data);
          
          let convertedSections: any[] = [];
          
          if (layoutMode === 'header' && layoutData.data.elements) {
            // Header uses elements format
            convertedSections = layoutData.data.elements.map((element: any) => ({
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
            if (layoutData.data.rows && layoutData.data.rows.length > 0) {
              // New multi-row format - convert rows to sections
              convertedSections = layoutData.data.rows.map((row: any, rowIndex: number) => ({
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
            } else if (layoutData.data.columns) {
              // Legacy single-row format - convert to single section with columns
              convertedSections = [{
                id: 'footer-section-1',
                columns: layoutData.data.columns.map((column: any, index: number) => ({
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
                  desktop: layoutData.data.settings || {}
                }
              }];
            }
          }
          
          console.log(`🔧 Converted ${layoutMode} sections:`, convertedSections);
          setElementorSections(convertedSections);
          setIsInitialized(true);
        } else if (!isLayoutLoading) {
          console.log(`🔧 Initializing ${layoutMode} builder with empty sections`);
          setElementorSections([]);
          setIsInitialized(true);
        }
      } else if (elementorSections.length === 0) {
        convertToElementorSections(pageData);
        setIsInitialized(true);
      }
    }
  }, [sections, convertToElementorSections, pageData, layoutMode, headerData, footerData, headerLoading, footerLoading, isInitialized]);

  // History management for Elementor
  const saveHistory = (newSections: ElementorSection[]) => {
    const newHistory = historyStack.slice(0, historyIndex + 1);
    newHistory.push(newSections);
    setHistoryStack(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElementorSections(historyStack[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElementorSections(historyStack[historyIndex + 1]);
    }
  };

  // Add new section (row) with single column by default
  const addElementorSection = (afterSectionId?: string) => {
    const timestamp = Date.now();
    const newSection: ElementorSection = {
      id: `section-${timestamp}`,
      columns: [
        {
          id: `column-${timestamp}-0`,
          widgets: [],
          settings: {
            desktop: {
              width: 100,
              padding: '20px',
              backgroundColor: 'transparent'
            }
          }
        }
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
      }
    };

    const newSections = [...elementorSections];
    if (afterSectionId) {
      const index = newSections.findIndex(s => s.id === afterSectionId);
      newSections.splice(index + 1, 0, newSection);
    } else {
      newSections.push(newSection);
    }
    
    setElementorSections(newSections);
    saveHistory(newSections);
  };

  // Create section with selected layout (keep for column layout options within section)
  const createSectionWithLayout = (layout: SectionLayout) => {
    console.log('🏗️ Creating section with layout:', layout, 'Current sections:', elementorSections.length);
    console.log('🏗️ Layout mode:', layoutMode, 'isInitialized:', isInitialized);
    const timestamp = Date.now();
    const columns = layout.columns.map((width, index) => ({
      id: `column-${timestamp}-${index}`,
      widgets: [],
      settings: {
        desktop: {
          width,
          padding: '20px',
          backgroundColor: 'transparent'
        }
      }
    }));

    const newSection: ElementorSection = {
      id: `section-${timestamp}`,
      columns,
      settings: {
        desktop: {
          layout: 'boxed',
          contentWidth: '1140px',
          backgroundColor: 'transparent',
          padding: '60px 20px',
          margin: '0',
          columnsPerRow: layout.columns.length,
          columnGap: '1rem',
          rowGap: '1rem',
          alignItems: 'stretch'
        }
      }
    };

    const newSections = [...elementorSections];
    if (afterSectionId) {
      const index = newSections.findIndex(s => s.id === afterSectionId);
      newSections.splice(index + 1, 0, newSection);
    } else {
      newSections.push(newSection);
    }
    
    setElementorSections(newSections);
    saveHistory(newSections);
  };

  // Delete Elementor section
  const deleteElementorSection = (sectionId: string) => {
    const newSections = elementorSections.filter(s => s.id !== sectionId);
    setElementorSections(newSections);
    saveHistory(newSections);
    if (selectedElement?.type === 'section' && selectedElement.id === sectionId) {
      setSelectedElement(null);
    }
  };

  // Clear all sections
  const clearAllSections = () => {
    if (window.confirm('Are you sure you want to delete all sections? This action cannot be undone.')) {
      setElementorSections([]);
      setSelectedElement(null);
      saveHistory([]);
    }
  };

  // Add column to section
  const addColumnToSection = (sectionId: string) => {
    console.log('🔧 Adding column to section:', sectionId, 'Current sections:', elementorSections.length);
    
    const newSections = elementorSections.map(section => {
      if (section.id === sectionId) {
        // Get current responsive settings to check if using columnsPerRow
        const currentSettings = getResponsiveValue ? getResponsiveValue(
          section.settings,
          {
            layout: 'boxed',
            contentWidth: '1140px',
            backgroundColor: 'transparent',
            padding: '60px 20px',
            margin: '0',
            columnsPerRow: Array.isArray(section.columns) ? section.columns.length : 1,
            columnGap: '1rem',
            rowGap: '1rem',
            alignItems: 'stretch'
          }
        ) : section.settings.desktop || section.settings;

        const newColumn = {
          id: `column-${Date.now()}`,
          widgets: [],
          settings: {
            desktop: {
              width: 100, // Will be overridden by columnsPerRow calculation
              padding: '20px',
              backgroundColor: 'transparent'
            }
          }
        };

        // Update columnsPerRow to match the new number of columns
        const updatedSectionSettings = updateResponsiveSetting(
          section.settings,
          devicePreview as ResponsiveBreakpoint,
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
    
    setElementorSections(newSections);
    saveHistory(newSections);
  };

  // Apply layout preset to section
  const applySectionLayout = (sectionId: string, layout: SectionLayout) => {
    const newSections = elementorSections.map(section => {
      if (section.id === sectionId) {
        const timestamp = Date.now();
        // Preserve existing widgets by distributing them across new columns
        const existingWidgets = Array.isArray(section.columns) 
          ? section.columns.flatMap(col => Array.isArray(col.widgets) ? col.widgets : [])
          : [];
        
        const newColumns = layout.columns.map((width, index) => ({
          id: `column-${timestamp}-${index}`,
          widgets: index < existingWidgets.length ? [existingWidgets[index]] : [],
          settings: {
            desktop: {
              width,
              padding: '20px',
              backgroundColor: 'transparent'
            }
          }
        }));
        
        return {
          ...section,
          columns: newColumns
        };
      }
      return section;
    });
    
    setElementorSections(newSections);
    saveHistory(newSections);
  };

  // Remove column from section
  const removeColumnFromSection = (sectionId: string, columnId: string) => {
    const newSections = elementorSections.map(section => {
      if (section.id === sectionId) {
        const currentColumns = Array.isArray(section.columns) ? section.columns : [];
        const remainingColumns = currentColumns.filter(col => col.id !== columnId);
        
        // If no columns remain, delete the entire section
        if (remainingColumns.length === 0) {
          return null; // Mark section for removal
        }
        
        // Update columnsPerRow to match the new number of columns
        const updatedSectionSettings = updateResponsiveSetting(
          section.settings,
          devicePreview as ResponsiveBreakpoint,
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
    }).filter(section => section !== null); // Remove sections marked for deletion
    
    setElementorSections(newSections);
    saveHistory(newSections);
    if (selectedElement?.type === 'column' && selectedElement.id === columnId) {
      setSelectedElement(null);
    }
  };

  // Duplicate column within section
  const duplicateColumnInSection = (sectionId: string, columnId: string) => {
    const newSections = elementorSections.map(section => {
      if (section.id === sectionId) {
        const currentColumns = Array.isArray(section.columns) ? section.columns : [];
        const columnIndex = currentColumns.findIndex(col => col.id === columnId);
        if (columnIndex !== -1) {
          const originalColumn = currentColumns[columnIndex];
          const timestamp = Date.now();
          
          // Create duplicate column with new ID but same settings and widgets
          const duplicatedColumn = {
            ...originalColumn,
            id: `column-${timestamp}`,
            widgets: Array.isArray(originalColumn.widgets) 
              ? originalColumn.widgets.map((widget, widgetIndex) => ({
                  ...widget,
                  id: `widget-${timestamp}-${widgetIndex}`
                }))
              : []
          };
          
          // Insert duplicated column right after the original
          const newColumns = [
            ...currentColumns.slice(0, columnIndex + 1),
            duplicatedColumn,
            ...currentColumns.slice(columnIndex + 1)
          ];
          
          // Update columnsPerRow to match the new number of columns
          const updatedSectionSettings = updateResponsiveSetting(
            section.settings,
            devicePreview as ResponsiveBreakpoint,
            {
              columnsPerRow: newColumns.length
            }
          );
          
          return {
            ...section,
            columns: newColumns,
            settings: updatedSectionSettings
          };
        }
      }
      return section;
    });
    
    setElementorSections(newSections);
    saveHistory(newSections);
  };

  // Open layout panel for existing section
  const openLayoutPanelForSection = (sectionId: string) => {
    setTargetSectionForLayout(sectionId);
    setShowSectionLayoutPanel(true);
  };

  // Duplicate Elementor section
  const duplicateElementorSection = (sectionId: string) => {
    const section = elementorSections.find(s => s.id === sectionId);
    if (!section) return;

    const duplicatedSection = {
      ...section,
      id: `section-${Date.now()}`,
      columns: section.columns.map(col => ({
        ...col,
        id: `column-${Date.now()}-${Math.random()}`,
        widgets: col.widgets.map(widget => ({
          ...widget,
          id: `widget-${Date.now()}-${Math.random()}`
        }))
      }))
    };

    const index = elementorSections.findIndex(s => s.id === sectionId);
    const newSections = [...elementorSections];
    newSections.splice(index + 1, 0, duplicatedSection);
    
    setElementorSections(newSections);
    saveHistory(newSections);
  };

  // Update Elementor section settings
  const updateElementorSectionSettings = (sectionId: string, settings: any) => {
    const newSections = elementorSections.map(section => 
      section.id === sectionId 
        ? { ...section, settings: settings }
        : section
    );
    setElementorSections(newSections);
    saveHistory(newSections);
  };

  // Update Elementor column settings
  const updateElementorColumnSettings = (columnId: string, settings: any) => {
    const newSections = elementorSections.map(section => ({
      ...section,
      columns: section.columns.map(column =>
        column.id === columnId
          ? { ...column, settings: settings }
          : column
      )
    }));
    setElementorSections(newSections);
    saveHistory(newSections);
  };

  // Update Elementor widget settings
  const updateElementorWidgetSettings = (widgetId: string, settings: any) => {
    const newSections = elementorSections.map(section => ({
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
    setElementorSections(newSections);
    saveHistory(newSections);
  };

  // Clear Elementor section content (remove all widgets from all columns)
  const clearElementorSection = (sectionId: string) => {
    const newSections = elementorSections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            columns: section.columns.map(column => ({
              ...column,
              widgets: [] // Clear all widgets from the column
            }))
          }
        : section
    );
    setElementorSections(newSections);
    saveHistory(newSections);
  };

  // Add widget to Elementor column
  const addElementorWidget = (columnId: string, widget: Omit<ElementorWidget, 'id'>, position?: number) => {
    console.log('🔧 Adding widget to column:', columnId);
    
    const newWidget: ElementorWidget = {
      ...widget,
      id: `widget-${Date.now()}`
    };

    setElementorSections(currentSections => {
      console.log('🔧 Current sections in callback:', currentSections.length);
      
      // Log current section structure
      currentSections.forEach((section, index) => {
        const columns = Array.isArray(section.columns) ? section.columns : [];
        console.log(`Section ${index}: ${columns.length} columns`, 
          columns.map(col => ({id: col.id, widgets: Array.isArray(col.widgets) ? col.widgets.length : 0})));
      });

      const newSections = currentSections.map(section => {
        console.log('🔍 Processing section with columns:', Array.isArray(section.columns) ? section.columns.map(c => c.id) : []);
        
        const newColumns = Array.isArray(section.columns) ? section.columns.map(column => {
          console.log(`🔍 Processing column ${column.id}, target: ${columnId}, match: ${column.id === columnId}`);
          
          if (column.id === columnId) {
            const existingWidgets = Array.isArray(column.widgets) ? column.widgets : [];
            const newWidgets = [...existingWidgets];
            if (position !== undefined) {
              newWidgets.splice(position, 0, newWidget);
            } else {
              newWidgets.push(newWidget);
            }
            console.log(`✅ Added widget to column ${columnId}, now has ${newWidgets.length} widgets`);
            return { ...column, widgets: newWidgets };
          }
          const columnWidgetCount = Array.isArray(column.widgets) ? column.widgets.length : 0;
          console.log(`⏭️ Keeping column ${column.id} unchanged with ${columnWidgetCount} widgets`);
          return column;
        }) : [];
        
        console.log('🔍 Section after mapping has columns:', Array.isArray(newColumns) ? newColumns.map(c => c.id) : []);
        
        return {
          ...section,
          columns: newColumns
        };
      });

      console.log('🔧 New sections after adding widget:', newSections.length);
      
      // Log new section structure
      newSections.forEach((section, index) => {
        const columns = Array.isArray(section.columns) ? section.columns : [];
        console.log(`New Section ${index}: ${columns.length} columns`, 
          columns.map(col => ({id: col.id, widgets: Array.isArray(col.widgets) ? col.widgets.length : 0})));
      });

      // Save history with the new sections
      saveHistory(newSections);
      
      return newSections;
    });
  };

  // Delete Elementor widget
  const deleteElementorWidget = (widgetId: string) => {
    const newSections = elementorSections.map(section => ({
      ...section,
      columns: section.columns.map(column => ({
        ...column,
        widgets: column.widgets.filter(widget => widget.id !== widgetId)
      }))
    }));
    
    setElementorSections(newSections);
    saveHistory(newSections);
    if (selectedElement?.type === 'widget' && selectedElement.id === widgetId) {
      setSelectedElement(null);
    }
  };

  // Handle save
  const handleSave = async () => {
    // If no pageId is provided, use the onSave prop (for layout building)
    if (!pageId) {
      if (onSave) {
        console.log('💾 Saving layout data via onSave prop...', {
          sectionsCount: elementorSections.length,
          sections: elementorSections.map(s => ({
            id: s.id,
            columnsCount: s.columns.length,
            totalWidgets: s.columns.reduce((acc, col) => acc + col.widgets.length, 0)
          }))
        });
        
        try {
          await onSave({
            sections: elementorSections,
            deviceSettings: {
              desktop: {},
              tablet: {},
              mobile: {}
            }
          });
          console.log('✅ Layout saved successfully via onSave');
          
          // Show success toast
          toaster({
            text: 'Layout saved successfully!',
            status: 'success',
            description: 'Your changes have been saved.'
          });
          
          return;
        } catch (error) {
          console.error('❌ Failed to save layout via onSave:', error);
          
          // Show error toast
          toaster({
            text: 'Failed to save layout',
            status: 'error',
            description: 'Please try again or contact support if the problem persists.'
          });
          
          return;
        }
      } else {
        console.error('No pageId provided for saving and no onSave callback available');
        
        // Show error toast
        toaster({
          text: 'Unable to save',
          status: 'error', 
          description: 'No page ID or save callback available.'
        });
        
        return;
      }
    }

    console.log('💾 Starting page save process...', {
      pageId,
      sectionsCount: elementorSections.length,
      sections: elementorSections.map(s => ({
        id: s.id,
        columnsCount: s.columns.length,
        totalWidgets: s.columns.reduce((acc, col) => acc + col.widgets.length, 0)
      }))
    });

    try {
      const deviceSettings = {
        desktop: {},
        tablet: {},
        mobile: {}
      };

      // Ensure sections is always an array, even when empty
      const sectionsToSave = Array.isArray(elementorSections) ? elementorSections : [];
      
      const result = await saveElementorPageData({
        pageId,
        sections: sectionsToSave,
        deviceSettings
      }).unwrap();

      console.log('✅ Page saved successfully:', result);

      // Show success toast
      toaster({
        text: 'Page saved successfully!',
        status: 'success',
        description: 'Your changes have been saved and are now live.'
      });

      // Call the optional onSave callback for any additional handling
      onSave?.({
        sections: elementorSections,
        deviceSettings
      });

    } catch (error) {
      console.error('❌ Failed to save page:', error);
      
      // Show error toast
      toaster({
        text: 'Failed to save page',
        status: 'error',
        description: 'Please try again or contact support if the problem persists.'
      });
    }
  };

  // Handle exit
  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Any unsaved changes will be lost.')) {
      onExit?.();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSaving) {
          handleSave();
        }
      }
      if (e.key === 'Delete' && selectedElement) {
        e.preventDefault();
        if (selectedElement.type === 'section') {
          deleteElementorSection(selectedElement.id);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElement) {
        e.preventDefault();
        if (selectedElement.type === 'section') {
          duplicateElementorSection(selectedElement.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, historyIndex]);

  // Render the top bar with minimal design
  const renderTopBar = () => (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleExit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Exit Builder"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <h1 className="text-sm font-medium text-gray-900">Page Builder</h1>
        </div>

        {/* Center section - Device Preview */}
        <div className="flex items-center space-x-2">
          {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
            <button
              key={device}
              onClick={() => setDevicePreview(device)}
              className={`p-2 rounded-lg transition-colors ${
                devicePreview === device 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title={`${device.charAt(0).toUpperCase() + device.slice(1)} Preview`}
            >
              {device === 'desktop' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {device === 'tablet' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              {device === 'mobile' && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Undo/Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= historyStack.length - 1}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>
          
          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {/* Preview Mode */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isPreviewMode 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isPreviewMode ? 'Exit Preview' : 'Preview'}
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isSaving 
                ? 'bg-gray-700 cursor-not-allowed shadow-md' 
                : 'bg-gray-900 hover:bg-gray-800 hover:shadow-md'
            } text-white`}
          >
            {isSaving && (
              <svg className="animate-spin -ml-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="unified-builder h-screen flex flex-col bg-gray-50 relative">
        {/* Saving Overlay */}
        {isSaving && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <div>
                  <p className="text-gray-900 font-medium">
                    {layoutMode ? `Saving ${layoutMode}...` : 'Saving page...'}
                  </p>
                  <p className="text-gray-600 text-sm">Please wait while we save your changes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
        {renderTopBar()}

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel */}
          {!isPreviewMode && (
            <div className="w-72 bg-white border-r border-gray-200 relative z-50">
              {/* Show widgets panel when no element is selected */}
              {!selectedElement && (
                <ElementorWidgetsPanel
                  onClose={() => {}}
                  onAddWidget={addElementorWidget}
                  selectedColumnId=""
                />
              )}

              {/* Show settings when element is selected */}
              {selectedElement && (
                <>
                  {/* Simple Header with back button and delete */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleElementSelect(null)}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors mr-2"
                        title="Back to widgets"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </button>
                      <h2 className="text-sm font-medium text-gray-900">
                        {(() => {
                          if (selectedElement.type === 'section') {
                            return `Section ${elementorSections.findIndex(s => s.id === selectedElement.id) + 1}`;
                          }
                          if (selectedElement.type === 'column') {
                            return 'Column';
                          }
                          if (selectedElement.type === 'widget') {
                            // Get the widget data to show its type
                            for (const section of elementorSections) {
                              for (const column of section.columns) {
                                const widget = column.widgets.find(w => w.id === selectedElement.id);
                                if (widget) {
                                  return widget.type.split('-').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ');
                                }
                              }
                            }
                            return 'Widget';
                          }
                          return 'Element';
                        })()}
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedElement.type === 'section') {
                          deleteElementorSection(selectedElement.id);
                        } else if (selectedElement.type === 'widget') {
                          deleteElementorWidget(selectedElement.id);
                        } else if (selectedElement.type === 'column') {
                          // Find the section containing this column
                          for (const section of elementorSections) {
                            const currentColumns = Array.isArray(section.columns) ? section.columns : [];
                            if (currentColumns.some(col => col.id === selectedElement.id)) {
                              removeColumnFromSection(section.id, selectedElement.id);
                              break;
                            }
                          }
                        }
                        handleElementSelect(null);
                      }}
                      className="p-1.5 hover:bg-red-100 rounded transition-colors group"
                      title="Delete element"
                    >
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Panel Navigation */}
                  <div className="flex border-b border-gray-200 bg-white">
                    <button
                      onClick={() => setActivePanel('content')}
                      className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
                        activePanel === 'content' 
                          ? 'text-gray-900 border-b-2 border-gray-900' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Content
                    </button>
                    <button
                      onClick={() => setActivePanel('style')}
                      className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
                        activePanel === 'style' 
                          ? 'text-gray-900 border-b-2 border-gray-900' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Style
                    </button>
                    <button
                      onClick={() => setActivePanel('settings')}
                      className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
                        activePanel === 'settings' 
                          ? 'text-gray-900 border-b-2 border-gray-900' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Advanced
                    </button>
                  </div>

                  {/* Settings Content */}
                  <div className="flex-1 overflow-y-auto">
                    <ElementorSettingsPanel
                      selectedElement={selectedElement}
                      sections={elementorSections}
                      onUpdateSettings={(settings) => {
                        if (selectedElement.type === 'section') {
                          updateElementorSectionSettings(selectedElement.id, settings);
                        } else if (selectedElement.type === 'column') {
                          updateElementorColumnSettings(selectedElement.id, settings);
                        } else if (selectedElement.type === 'widget') {
                          updateElementorWidgetSettings(selectedElement.id, settings);
                        }
                      }}
                      onClearSection={(sectionId) => clearElementorSection(sectionId)}
                      onClose={() => handleElementSelect(null)}
                      activeTab={activePanel}
                      currentBreakpoint={devicePreview as ResponsiveBreakpoint}
                      updateResponsiveSetting={updateResponsiveSetting}
                      onBreakpointChange={handleSidebarDeviceChange}
                      websiteId={websiteId}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigator Panel */}
          {!isPreviewMode && showNavigator && (
            <ElementorNavigator
              sections={elementorSections}
              selectedElement={selectedElement}
              onSelectElement={handleElementSelect}
              onClose={() => setShowNavigator(false)}
              onDeleteSection={deleteElementorSection}
              onDuplicateSection={duplicateElementorSection}
            />
          )}

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col bg-gray-100">
            {console.log('🎨 Rendering ElementorCanvas with:', { 
              sectionsCount: elementorSections.length, 
              layoutMode, 
              isInitialized,
              hasOnSelectLayout: !!createSectionWithLayout
            })}
            <ElementorCanvas
              ref={canvasRef}
              sections={elementorSections}
              setSections={setElementorSections}
              selectedElement={selectedElement}
              setSelectedElement={handleElementSelect}
              devicePreview={devicePreview}
              isPreviewMode={isPreviewMode}
              onAddSection={addElementorSection}
              onDeleteSection={deleteElementorSection}
              onDuplicateSection={duplicateElementorSection}
              onAddWidget={addElementorWidget}
              onClearAllSections={clearAllSections}
              saveHistory={saveHistory}
              headerData={headerData}
              footerData={footerData}
              onAddColumn={addColumnToSection}
              onApplyLayout={openLayoutPanelForSection}
              onRemoveColumn={removeColumnFromSection}
              onDuplicateColumn={duplicateColumnInSection}
              onResizeColumn={() => {}}
              getResponsiveValue={getResponsiveValue}
              currentBreakpoint={devicePreview as ResponsiveBreakpoint}
              layoutMode={layoutMode}
              onSelectLayout={createSectionWithLayout}
            />
          </div>


        </div>

        {/* Section Layout Panel */}
        {showSectionLayoutPanel && (
          <SectionLayoutPanel
            onSelectLayout={(layout) => {
              if (targetSectionForLayout) {
                // Apply layout to existing section
                applySectionLayout(targetSectionForLayout, layout);
                setTargetSectionForLayout(undefined);
              } else {
                // Create new section with layout
                createSectionWithLayout(layout);
                setAfterSectionId(undefined);
              }
            }}
            onClose={() => {
              setShowSectionLayoutPanel(false);
              setAfterSectionId(undefined);
              setTargetSectionForLayout(undefined);
            }}
          />
        )}

      </div>
    </DndProvider>
  );
}