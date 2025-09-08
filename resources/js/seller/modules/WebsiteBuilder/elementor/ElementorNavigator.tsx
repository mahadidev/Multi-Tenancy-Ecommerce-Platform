import React, { useState } from 'react';
import { ElementorSection, ElementorColumn, ElementorWidget } from './ElementorBuilder';

interface ElementorNavigatorProps {
  sections: ElementorSection[];
  selectedElement: {
    type: 'section' | 'column' | 'widget';
    id: string;
  } | null;
  onSelectElement: (element: { type: 'section' | 'column' | 'widget'; id: string }) => void;
  onClose: () => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
}

interface TreeItemProps {
  icon: JSX.Element;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  onRightClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  level: number;
}

const TreeItem = ({ 
  icon, 
  label, 
  isSelected, 
  onClick, 
  onRightClick,
  children, 
  isExpanded, 
  onToggleExpand,
  level 
}: TreeItemProps) => {
  return (
    <div>
      <div
        className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-[#71d7f7] text-white hover:bg-[#5bc0de]' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={onClick}
        onContextMenu={onRightClick}
      >
        <div className="flex items-center flex-1">
          {children && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              className="mr-1 p-0.5 hover:bg-black/10 rounded"
            >
              <svg 
                className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <div className="mr-2 text-gray-400">
            {icon}
          </div>
          <span className="text-sm truncate">{label}</span>
        </div>
      </div>
      {children && isExpanded && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

const WidgetIcon = ({ type }: { type: string }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    'heading': <span className="text-xs font-bold">H</span>,
    'text-editor': <span className="text-xs">T</span>,
    'image': <span className="text-xs">📷</span>,
    'video': <span className="text-xs">🎥</span>,
    'button': <span className="text-xs">🔘</span>,
    'spacer': <span className="text-xs">⚏</span>,
    'posts': <span className="text-xs">📄</span>,
    'portfolio': <span className="text-xs">🎨</span>,
    'testimonials': <span className="text-xs">💬</span>,
    'contact-form': <span className="text-xs">📝</span>,
    'icon': <span className="text-xs">⭐</span>,
    'icon-box': <span className="text-xs">📦</span>,
    'star-rating': <span className="text-xs">⭐</span>,
    'image-box': <span className="text-xs">🖼️</span>,
    'counter': <span className="text-xs">🔢</span>,
    'progress': <span className="text-xs">📊</span>,
  };

  return iconMap[type] || <span className="text-xs">⚪</span>;
};

export function ElementorNavigator({
  sections,
  selectedElement,
  onSelectElement,
  onClose,
  onDeleteSection,
  onDuplicateSection
}: ElementorNavigatorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'section' | 'column' | 'widget';
    id: string;
  } | null>(null);

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleColumnExpansion = (columnId: string) => {
    const newExpanded = new Set(expandedColumns);
    if (newExpanded.has(columnId)) {
      newExpanded.delete(columnId);
    } else {
      newExpanded.add(columnId);
    }
    setExpandedColumns(newExpanded);
  };

  const handleContextMenu = (e: React.MouseEvent, type: 'section' | 'column' | 'widget', id: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      id
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenu) return;

    switch (action) {
      case 'delete':
        if (contextMenu.type === 'section') {
          onDeleteSection(contextMenu.id);
        }
        break;
      case 'duplicate':
        if (contextMenu.type === 'section') {
          onDuplicateSection(contextMenu.id);
        }
        break;
    }
    closeContextMenu();
  };

  return (
    <>
      <div className="w-80 bg-white h-full flex flex-col shadow-lg border-r border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#495057] text-white">
          <h2 className="text-lg font-semibold">Navigator</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Structure Tree */}
        <div className="flex-1 overflow-y-auto">
          {sections.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No sections yet</p>
              <p className="text-xs mt-2">Start building your page!</p>
            </div>
          ) : (
            <div className="py-2">
              {sections.map((section) => (
                <TreeItem
                  key={section.id}
                  icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                  </svg>}
                  label={`Section ${sections.indexOf(section) + 1}`}
                  isSelected={selectedElement?.type === 'section' && selectedElement.id === section.id}
                  onClick={() => onSelectElement({ type: 'section', id: section.id })}
                  onRightClick={(e) => handleContextMenu(e, 'section', section.id)}
                  isExpanded={expandedSections.has(section.id)}
                  onToggleExpand={() => toggleSectionExpansion(section.id)}
                  level={0}
                >
                  {section.columns.map((column) => (
                    <TreeItem
                      key={column.id}
                      icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                      </svg>}
                      label={`Column ${section.columns.indexOf(column) + 1} (${column.width}%)`}
                      isSelected={selectedElement?.type === 'column' && selectedElement.id === column.id}
                      onClick={() => onSelectElement({ type: 'column', id: column.id })}
                      onRightClick={(e) => handleContextMenu(e, 'column', column.id)}
                      isExpanded={expandedColumns.has(column.id)}
                      onToggleExpand={() => toggleColumnExpansion(column.id)}
                      level={1}
                    >
                      {column.widgets.map((widget) => (
                        <TreeItem
                          key={widget.id}
                          icon={<WidgetIcon type={widget.type} />}
                          label={widget.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          isSelected={selectedElement?.type === 'widget' && selectedElement.id === widget.id}
                          onClick={() => onSelectElement({ type: 'widget', id: widget.id })}
                          onRightClick={(e) => handleContextMenu(e, 'widget', widget.id)}
                          level={2}
                        />
                      ))}
                      {column.widgets.length === 0 && (
                        <div className="py-2 px-3 text-xs text-gray-400" style={{ paddingLeft: '60px' }}>
                          Drop widgets here
                        </div>
                      )}
                    </TreeItem>
                  ))}
                </TreeItem>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Right-click items for more options
          </p>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeContextMenu}
          ></div>
          <div
            className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-32"
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`,
            }}
          >
            <button
              onClick={() => handleContextMenuAction('duplicate')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Duplicate
            </button>
            <button
              onClick={() => handleContextMenuAction('delete')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </>
      )}
    </>
  );
}