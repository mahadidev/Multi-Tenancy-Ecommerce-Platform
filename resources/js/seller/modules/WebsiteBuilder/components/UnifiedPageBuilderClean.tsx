import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ElementorCanvas } from '../elementor/ElementorCanvas';
import { ElementorNavigator } from '../elementor/ElementorNavigator';
import { SectionLayoutPanel, type SectionLayout } from '../elementor/SectionLayoutPanel';
import { BuilderTopBar } from './ui/BuilderTopBar';
import { BuilderSidebar } from './ui/BuilderSidebar';
import { SavingOverlay } from './ui/SavingOverlay';
import { useGetHeaderQuery, useGetFooterQuery, useSaveElementorPageDataMutation } from '../store/websiteBuilderApi';
import { useBuilderHistory } from '../hooks/useBuilderHistory';
import { useBuilderKeyboard } from '../hooks/useBuilderKeyboard';
import { ElementorService } from '../services/ElementorService';
import { BuilderService } from '../services/BuilderService';
import { getResponsiveValue, updateResponsiveSetting } from '../utils/responsive';
import { convertToElementorSections, convertLayoutData } from '../utils/dataConversion';
import useToast from '@seller/_hooks/useToast';
import type { ComponentType, PageComponent, PageSection } from '../types';
import type { ElementorSection, ResponsiveBreakpoint } from '../elementor/ElementorBuilder';

interface UnifiedPageBuilderProps {
  componentTypes: ComponentType[];
  sections: PageSection[];
  websiteId: number;
  pageId?: number;
  pageData?: any;
  layoutMode?: 'header' | 'footer';
  onDropComponent: (componentTypeId: number, sectionId: number, position: number) => void;
  onUpdateComponent: (componentId: number, updates: any) => void;
  onDeleteComponent: (componentId: number) => void;
  onSelectComponent: (component: PageComponent) => void;
  selectedComponent?: PageComponent | null;
  onSave?: (data: any) => void;
  onExit?: () => void;
  externalSaving?: boolean;
}

export function UnifiedPageBuilderClean({
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
  // UI State
  const [activePanel, setActivePanel] = useState<'content' | 'style' | 'settings' | null>('widgets');
  const [devicePreview, setDevicePreview] = useState<ResponsiveBreakpoint>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [showSectionLayoutPanel, setShowSectionLayoutPanel] = useState(false);
  const [afterSectionId, setAfterSectionId] = useState<string | undefined>(undefined);
  const [targetSectionForLayout, setTargetSectionForLayout] = useState<string | undefined>(undefined);
  
  // Data State
  const [elementorSections, setElementorSections] = useState<ElementorSection[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedElement, setSelectedElement] = useState<{
    type: 'section' | 'column' | 'widget';
    id: string;
  } | null>(null);
  
  // API hooks
  const { data: headerData, isLoading: headerLoading } = useGetHeaderQuery(websiteId);
  const { data: footerData, isLoading: footerLoading } = useGetFooterQuery(websiteId);
  const [saveElementorPageData, { isLoading: internalSaving }] = useSaveElementorPageDataMutation();
  const { toaster } = useToast();
  
  // Custom hooks
  const { saveHistory, undo, redo, canUndo, canRedo, historyIndex } = useBuilderHistory(elementorSections);
  
  // Derived state
  const isSaving = externalSaving || internalSaving;
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize elementor sections
  useEffect(() => {
    if (!isInitialized) {
      if (layoutMode) {
        const layoutData = layoutMode === 'header' ? headerData : footerData;
        const isLayoutLoading = layoutMode === 'header' ? headerLoading : footerLoading;
        
        if (!isLayoutLoading && layoutData?.data) {
          const convertedSections = convertLayoutData(layoutData.data, layoutMode);
          setElementorSections(convertedSections);
          setIsInitialized(true);
        } else if (!isLayoutLoading) {
          setElementorSections([]);
          setIsInitialized(true);
        }
      } else if (elementorSections.length === 0) {
        const converted = convertToElementorSections(sections, pageData);
        setElementorSections(converted);
        setIsInitialized(true);
      }
    }
  }, [sections, pageData, layoutMode, headerData, footerData, headerLoading, footerLoading, isInitialized]);

  // Element selection handler
  const handleElementSelect = useCallback((element: { type: 'section' | 'column' | 'widget'; id: string } | null) => {
    setSelectedElement(element);
    if (element && activePanel === null) {
      setActivePanel('content');
    } else if (!element) {
      setActivePanel(null);
    }
  }, [activePanel]);

  // Section operations
  const handleAddSection = useCallback((afterSectionId?: string) => {
    const newSections = ElementorService.addSection(elementorSections, afterSectionId);
    setElementorSections(newSections);
    saveHistory(newSections);
  }, [elementorSections, saveHistory]);

  const handleCreateSectionWithLayout = useCallback((layout: SectionLayout) => {
    const newSections = ElementorService.addSectionWithLayout(elementorSections, layout, afterSectionId);
    setElementorSections(newSections);
    saveHistory(newSections);
    setAfterSectionId(undefined);
  }, [elementorSections, afterSectionId, saveHistory]);

  const handleDeleteSection = useCallback((sectionId: string) => {
    const newSections = ElementorService.deleteSection(elementorSections, sectionId);
    setElementorSections(newSections);
    saveHistory(newSections);
    if (selectedElement?.type === 'section' && selectedElement.id === sectionId) {
      setSelectedElement(null);
    }
  }, [elementorSections, selectedElement, saveHistory]);

  const handleDuplicateSection = useCallback((sectionId: string) => {
    const newSections = ElementorService.duplicateSection(elementorSections, sectionId);
    setElementorSections(newSections);
    saveHistory(newSections);
  }, [elementorSections, saveHistory]);

  const handleClearAllSections = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all sections? This action cannot be undone.')) {
      const newSections = ElementorService.clearAllSections();
      setElementorSections(newSections);
      setSelectedElement(null);
      saveHistory(newSections);
    }
  }, [saveHistory]);

  // Widget operations
  const handleAddWidget = useCallback((columnId: string, widget: any, position?: number) => {
    const newSections = ElementorService.addWidget(elementorSections, columnId, widget, position);
    setElementorSections(newSections);
    saveHistory(newSections);
  }, [elementorSections, saveHistory]);

  const handleDeleteWidget = useCallback((widgetId: string) => {
    const newSections = ElementorService.deleteWidget(elementorSections, widgetId);
    setElementorSections(newSections);
    saveHistory(newSections);
    if (selectedElement?.type === 'widget' && selectedElement.id === widgetId) {
      setSelectedElement(null);
    }
  }, [elementorSections, selectedElement, saveHistory]);

  // Settings updates
  const handleUpdateSectionSettings = useCallback((sectionId: string, settings: any) => {
    const newSections = ElementorService.updateSectionSettings(elementorSections, sectionId, settings);
    setElementorSections(newSections);
    saveHistory(newSections);
  }, [elementorSections, saveHistory]);

  const handleUpdateColumnSettings = useCallback((columnId: string, settings: any) => {
    const newSections = ElementorService.updateColumnSettings(elementorSections, columnId, settings);
    setElementorSections(newSections);
    saveHistory(newSections);
  }, [elementorSections, saveHistory]);

  const handleUpdateWidgetSettings = useCallback((widgetId: string, settings: any) => {
    const newSections = ElementorService.updateWidgetSettings(elementorSections, widgetId, settings);
    setElementorSections(newSections);
    saveHistory(newSections);
  }, [elementorSections, saveHistory]);

  // History operations
  const handleUndo = useCallback(() => {
    const previousSections = undo();
    if (previousSections) {
      setElementorSections(previousSections);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const nextSections = redo();
    if (nextSections) {
      setElementorSections(nextSections);
    }
  }, [redo]);

  // Save operation
  const handleSave = useCallback(async () => {
    const sectionsToSave = BuilderService.prepareSaveData(elementorSections);

    if (!BuilderService.validateSections(sectionsToSave)) {
      toaster({
        text: 'Invalid sections data',
        status: 'error',
        description: 'Please check your sections and try again.'
      });
      return;
    }

    if (!pageId) {
      if (onSave) {
        try {
          await BuilderService.saveLayout({
            sections: sectionsToSave,
            deviceSettings: { desktop: {}, tablet: {}, mobile: {} }
          }, onSave);
          
          toaster({
            text: 'Layout saved successfully!',
            status: 'success',
            description: 'Your changes have been saved.'
          });
        } catch (error) {
          toaster({
            text: 'Failed to save layout',
            status: 'error',
            description: 'Please try again or contact support if the problem persists.'
          });
        }
      }
      return;
    }

    try {
      await saveElementorPageData({
        pageId,
        sections: sectionsToSave,
        deviceSettings: { desktop: {}, tablet: {}, mobile: {} }
      }).unwrap();

      toaster({
        text: 'Page saved successfully!',
        status: 'success',
        description: 'Your changes have been saved and are now live.'
      });

      onSave?.({
        sections: sectionsToSave,
        deviceSettings: { desktop: {}, tablet: {}, mobile: {} }
      });
    } catch (error) {
      toaster({
        text: 'Failed to save page',
        status: 'error',
        description: 'Please try again or contact support if the problem persists.'
      });
    }
  }, [elementorSections, pageId, onSave, saveElementorPageData, toaster]);

  // Exit operation
  const handleExit = useCallback(() => {
    if (window.confirm('Are you sure you want to exit? Any unsaved changes will be lost.')) {
      onExit?.();
    }
  }, [onExit]);

  // Delete element handler for keyboard and UI
  const handleDeleteElement = useCallback(() => {
    if (!selectedElement) return;
    
    if (selectedElement.type === 'section') {
      handleDeleteSection(selectedElement.id);
    } else if (selectedElement.type === 'widget') {
      handleDeleteWidget(selectedElement.id);
    } else if (selectedElement.type === 'column') {
      for (const section of elementorSections) {
        const currentColumns = Array.isArray(section.columns) ? section.columns : [];
        if (currentColumns.some(col => col.id === selectedElement.id)) {
          const newSections = ElementorService.removeColumn(elementorSections, section.id, selectedElement.id, devicePreview);
          setElementorSections(newSections);
          saveHistory(newSections);
          break;
        }
      }
    }
    setSelectedElement(null);
  }, [selectedElement, elementorSections, devicePreview, handleDeleteSection, handleDeleteWidget, saveHistory]);

  const handleDuplicateElement = useCallback(() => {
    if (selectedElement?.type === 'section') {
      handleDuplicateSection(selectedElement.id);
    }
  }, [selectedElement, handleDuplicateSection]);

  // Keyboard shortcuts
  useBuilderKeyboard({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onSave: handleSave,
    onDelete: handleDeleteElement,
    onDuplicate: handleDuplicateElement,
    selectedElement,
    isSaving,
    historyIndex
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="unified-builder h-screen flex flex-col bg-gray-50 relative">
        <SavingOverlay isVisible={isSaving} layoutMode={layoutMode} />

        <BuilderTopBar
          devicePreview={devicePreview}
          onDeviceChange={setDevicePreview}
          isPreviewMode={isPreviewMode}
          onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          isSaving={isSaving}
          onSave={handleSave}
          onExit={handleExit}
          layoutMode={layoutMode}
        />

        <div className="flex-1 flex overflow-hidden">
          {!isPreviewMode && (
            <BuilderSidebar
              selectedElement={selectedElement}
              onSelectElement={handleElementSelect}
              elementorSections={elementorSections}
              activePanel={activePanel}
              onPanelChange={setActivePanel}
              devicePreview={devicePreview}
              onAddWidget={handleAddWidget}
              onUpdateSectionSettings={handleUpdateSectionSettings}
              onUpdateColumnSettings={handleUpdateColumnSettings}
              onUpdateWidgetSettings={handleUpdateWidgetSettings}
              onClearSection={(sectionId) => {
                const newSections = ElementorService.clearSection(elementorSections, sectionId);
                setElementorSections(newSections);
                saveHistory(newSections);
              }}
              onDeleteElement={handleDeleteElement}
              onRemoveColumn={(sectionId, columnId) => {
                const newSections = ElementorService.removeColumn(elementorSections, sectionId, columnId, devicePreview);
                setElementorSections(newSections);
                saveHistory(newSections);
              }}
              updateResponsiveSetting={updateResponsiveSetting}
              onBreakpointChange={setDevicePreview}
              websiteId={websiteId}
            />
          )}

          {!isPreviewMode && showNavigator && (
            <ElementorNavigator
              sections={elementorSections}
              selectedElement={selectedElement}
              onSelectElement={handleElementSelect}
              onClose={() => setShowNavigator(false)}
              onDeleteSection={handleDeleteSection}
              onDuplicateSection={handleDuplicateSection}
            />
          )}

          <div className="flex-1 flex flex-col bg-gray-100">
            <ElementorCanvas
              ref={canvasRef}
              sections={elementorSections}
              setSections={setElementorSections}
              selectedElement={selectedElement}
              setSelectedElement={handleElementSelect}
              devicePreview={devicePreview}
              isPreviewMode={isPreviewMode}
              onAddSection={handleAddSection}
              onDeleteSection={handleDeleteSection}
              onDuplicateSection={handleDuplicateSection}
              onAddWidget={handleAddWidget}
              onClearAllSections={handleClearAllSections}
              saveHistory={saveHistory}
              headerData={headerData}
              footerData={footerData}
              onAddColumn={(sectionId) => {
                const newSections = ElementorService.addColumn(elementorSections, sectionId, devicePreview);
                setElementorSections(newSections);
                saveHistory(newSections);
              }}
              onApplyLayout={(sectionId) => {
                setTargetSectionForLayout(sectionId);
                setShowSectionLayoutPanel(true);
              }}
              onRemoveColumn={(sectionId, columnId) => {
                const newSections = ElementorService.removeColumn(elementorSections, sectionId, columnId, devicePreview);
                setElementorSections(newSections);
                saveHistory(newSections);
              }}
              onDuplicateColumn={() => {}}
              onResizeColumn={() => {}}
              getResponsiveValue={(settings: any, fallback: any) => getResponsiveValue(settings, fallback, devicePreview)}
              currentBreakpoint={devicePreview}
              layoutMode={layoutMode}
              onSelectLayout={handleCreateSectionWithLayout}
            />
          </div>
        </div>

        {showSectionLayoutPanel && (
          <SectionLayoutPanel
            onSelectLayout={(layout) => {
              if (targetSectionForLayout) {
                // Apply layout to existing section - implement if needed
                setTargetSectionForLayout(undefined);
              } else {
                handleCreateSectionWithLayout(layout);
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