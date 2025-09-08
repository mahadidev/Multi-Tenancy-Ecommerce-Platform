import React from 'react';
import { ElementorWidgetsPanel } from '../../elementor/ElementorWidgetsPanel';
import { ElementorSettingsPanel } from '../../elementor/ElementorSettingsPanel';
import type { ElementorSection, ResponsiveBreakpoint } from '../../elementor/ElementorBuilder';

interface BuilderSidebarProps {
  selectedElement: { type: 'section' | 'column' | 'widget'; id: string } | null;
  onSelectElement: (element: { type: 'section' | 'column' | 'widget'; id: string } | null) => void;
  elementorSections: ElementorSection[];
  activePanel: 'content' | 'style' | 'settings' | null;
  onPanelChange: (panel: 'content' | 'style' | 'settings' | null) => void;
  devicePreview: ResponsiveBreakpoint;
  onAddWidget: (columnId: string, widget: any, position?: number) => void;
  onUpdateSectionSettings: (sectionId: string, settings: any) => void;
  onUpdateColumnSettings: (columnId: string, settings: any) => void;
  onUpdateWidgetSettings: (widgetId: string, settings: any) => void;
  onClearSection: (sectionId: string) => void;
  onDeleteElement: (elementType: 'section' | 'column' | 'widget', elementId: string) => void;
  onRemoveColumn: (sectionId: string, columnId: string) => void;
  updateResponsiveSetting: any;
  onBreakpointChange: (breakpoint: ResponsiveBreakpoint) => void;
  websiteId: number;
}

export function BuilderSidebar({
  selectedElement,
  onSelectElement,
  elementorSections,
  activePanel,
  onPanelChange,
  devicePreview,
  onAddWidget,
  onUpdateSectionSettings,
  onUpdateColumnSettings,
  onUpdateWidgetSettings,
  onClearSection,
  onDeleteElement,
  onRemoveColumn,
  updateResponsiveSetting,
  onBreakpointChange,
  websiteId
}: BuilderSidebarProps) {
  const handleDeleteElement = () => {
    if (!selectedElement) return;

    if (selectedElement.type === 'section') {
      onDeleteElement('section', selectedElement.id);
    } else if (selectedElement.type === 'widget') {
      onDeleteElement('widget', selectedElement.id);
    } else if (selectedElement.type === 'column') {
      for (const section of elementorSections) {
        const currentColumns = Array.isArray(section.columns) ? section.columns : [];
        if (currentColumns.some(col => col.id === selectedElement.id)) {
          onRemoveColumn(section.id, selectedElement.id);
          break;
        }
      }
    }
    onSelectElement(null);
  };

  const getElementTitle = () => {
    if (!selectedElement) return '';

    if (selectedElement.type === 'section') {
      return `Section ${elementorSections.findIndex(s => s.id === selectedElement.id) + 1}`;
    }
    if (selectedElement.type === 'column') {
      return 'Column';
    }
    if (selectedElement.type === 'widget') {
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
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 relative z-50">
      {!selectedElement ? (
        <ElementorWidgetsPanel
          onClose={() => {}}
          onAddWidget={onAddWidget}
          selectedColumnId=""
        />
      ) : (
        <>
          <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <button
                onClick={() => onSelectElement(null)}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors mr-2"
                title="Back to widgets"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h2 className="text-sm font-medium text-gray-900">{getElementTitle()}</h2>
            </div>
            <button
              onClick={handleDeleteElement}
              className="p-1.5 hover:bg-red-100 rounded transition-colors group"
              title="Delete element"
            >
              <svg className="w-4 h-4 text-gray-600 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="flex border-b border-gray-200 bg-white">
            <button
              onClick={() => onPanelChange('content')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
                activePanel === 'content' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => onPanelChange('style')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
                activePanel === 'style' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Style
            </button>
            <button
              onClick={() => onPanelChange('settings')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
                activePanel === 'settings' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Advanced
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ElementorSettingsPanel
              selectedElement={selectedElement}
              sections={elementorSections}
              onUpdateSettings={(settings) => {
                if (selectedElement.type === 'section') {
                  onUpdateSectionSettings(selectedElement.id, settings);
                } else if (selectedElement.type === 'column') {
                  onUpdateColumnSettings(selectedElement.id, settings);
                } else if (selectedElement.type === 'widget') {
                  onUpdateWidgetSettings(selectedElement.id, settings);
                }
              }}
              onClearSection={onClearSection}
              onClose={() => onSelectElement(null)}
              activeTab={activePanel}
              currentBreakpoint={devicePreview}
              updateResponsiveSetting={updateResponsiveSetting}
              onBreakpointChange={onBreakpointChange}
              websiteId={websiteId}
            />
          </div>
        </>
      )}
    </div>
  );
}