import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { ComponentType, PageComponent, PageSection } from '../types';

// Drag item types
const DragTypes = {
  COMPONENT_TYPE: 'COMPONENT_TYPE',
  PAGE_COMPONENT: 'PAGE_COMPONENT',
};

interface ComponentPaletteItemProps {
  componentType: ComponentType;
}

interface DroppableComponentProps {
  component: PageComponent;
  onUpdate: (componentId: number, props: Record<string, any>) => void;
  onDelete: (componentId: number) => void;
  onSelect: (component: PageComponent) => void;
  isSelected: boolean;
}

interface DroppableSectionProps {
  section: PageSection;
  onDropComponent: (componentTypeId: number, sectionId: number, position: number) => void;
  onUpdateComponent: (componentId: number, props: Record<string, any>) => void;
  onDeleteComponent: (componentId: number) => void;
  onSelectComponent: (component: PageComponent) => void;
  selectedComponentId?: number;
}

interface DragDropPageBuilderProps {
  componentTypes: ComponentType[];
  sections: PageSection[];
  onDropComponent: (componentTypeId: number, sectionId: number, position: number) => void;
  onUpdateComponent: (componentId: number, props: Record<string, any>) => void;
  onDeleteComponent: (componentId: number) => void;
  onSelectComponent: (component: PageComponent) => void;
  selectedComponent?: PageComponent | null;
}

// Component Palette Item (draggable)
const ComponentPaletteItem: React.FC<ComponentPaletteItemProps> = ({ componentType }) => {
  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.COMPONENT_TYPE,
    item: { componentType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`
        p-3 border border-gray-200 rounded-lg cursor-move transition-all
        hover:border-blue-300 hover:shadow-md
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      <div className="flex items-center space-x-3">
        {componentType.icon && (
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-blue-600 text-sm">{componentType.icon}</span>
          </div>
        )}
        <div>
          <h4 className="font-medium text-sm text-gray-900">{componentType.name}</h4>
          {componentType.description && (
            <p className="text-xs text-gray-500 mt-1">{componentType.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Droppable Component (can be dragged and edited)
const DroppableComponent: React.FC<DroppableComponentProps> = ({
  component,
  onUpdate,
  onDelete,
  onSelect,
  isSelected,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: DragTypes.PAGE_COMPONENT,
    item: { component },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = () => {
    onSelect(component);
  };

  const renderComponentPreview = () => {
    const props = parseProps(component.props);
    const componentType = component.component_type;

    // Simple preview based on component type
    switch (componentType?.slug) {
      case 'hero-banner':
        return (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded">
            <h1 className="text-2xl font-bold mb-2">{props.title || 'Hero Title'}</h1>
            <p className="mb-4">{props.subtitle || 'Hero subtitle'}</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded">
              {props.buttonText || 'Button'}
            </button>
          </div>
        );
      
      case 'text-block':
        return (
          <div className="p-4">
            {props.heading && <h2 className="text-xl font-semibold mb-2">{props.heading}</h2>}
            <p className="text-gray-700">{props.content || 'Text content goes here...'}</p>
          </div>
        );

      case 'product-grid':
        return (
          <div className="p-4">
            {props.title && <h2 className="text-xl font-semibold mb-4">{props.title}</h2>}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-200 rounded p-3">
                  <div className="bg-gray-200 h-24 rounded mb-2"></div>
                  <p className="text-sm font-medium">Product {i}</p>
                  <p className="text-xs text-gray-500">$99.99</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact-form':
        return (
          <div className="p-4">
            {props.title && <h2 className="text-xl font-semibold mb-4">{props.title}</h2>}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 border border-gray-200 rounded"
                disabled
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-200 rounded"
                disabled
              />
              <textarea
                placeholder="Message"
                rows={3}
                className="w-full p-2 border border-gray-200 rounded"
                disabled
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled>
                {props.submitText || 'Send Message'}
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 border border-gray-200 rounded">
            <p className="text-gray-600">{componentType?.name || 'Component'}</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`
        relative group cursor-pointer transition-all
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'}
      `}
    >
      {renderComponentPreview()}
      
      {/* Component controls overlay */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(component);
            }}
            className="bg-blue-600 text-white p-1 rounded text-xs hover:bg-blue-700"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
            className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

// Droppable Section
const DroppableSection: React.FC<DroppableSectionProps> = ({
  section,
  onDropComponent,
  onUpdateComponent,
  onDeleteComponent,
  onSelectComponent,
  selectedComponentId,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [DragTypes.COMPONENT_TYPE, DragTypes.PAGE_COMPONENT],
    drop: (item: any, monitor) => {
      if (monitor.didDrop()) return; // Prevent duplicate drops

      if (item.componentType) {
        // Dropping a new component type
        onDropComponent(item.componentType.id, section.id, section.components?.length || 0);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`
        min-h-[100px] border-2 border-dashed rounded-lg p-4 transition-all
        ${isOver && canDrop ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
        ${section.components && section.components.length > 0 ? 'bg-white' : 'bg-gray-50'}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">
          {section.name || `Section ${section.id}`}
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {section.type}
        </span>
      </div>

      {section.components && section.components.length > 0 ? (
        <div className="space-y-4">
          {section.components.map((component) => (
            <DroppableComponent
              key={component.id}
              component={component}
              onUpdate={onUpdateComponent}
              onDelete={onDeleteComponent}
              onSelect={onSelectComponent}
              isSelected={selectedComponentId === component.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Drop components here</p>
        </div>
      )}
    </div>
  );
};

// Helper function to parse props (they might be JSON strings from the database)
const parseProps = (props: any): Record<string, any> => {
  if (typeof props === 'string') {
    try {
      return JSON.parse(props);
    } catch (e) {
      return {};
    }
  }
  return props || {};
};

// Main Page Builder Component
const DragDropPageBuilder: React.FC<DragDropPageBuilderProps> = ({
  componentTypes,
  sections,
  onDropComponent,
  onUpdateComponent,
  onDeleteComponent,
  onSelectComponent,
  selectedComponent,
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full">
        {/* Component Palette */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <div className="space-y-3">
            {componentTypes.map((componentType) => (
              <ComponentPaletteItem
                key={componentType.id}
                componentType={componentType}
              />
            ))}
          </div>
        </div>

        {/* Page Canvas */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {sections.map((section) => (
                <DroppableSection
                  key={section.id}
                  section={section}
                  onDropComponent={onDropComponent}
                  onUpdateComponent={onUpdateComponent}
                  onDeleteComponent={onDeleteComponent}
                  onSelectComponent={onSelectComponent}
                  selectedComponentId={selectedComponent?.id}
                />
              ))}
              
              {sections.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No sections available. Create a section to start building your page.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        {selectedComponent && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Properties</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Component Name
                </label>
                <input
                  type="text"
                  value={selectedComponent.name || ''}
                  onChange={(e) => onUpdateComponent(selectedComponent.id, { name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="Component name"
                />
              </div>
              
              {/* Dynamic props editing based on component schema */}
              {selectedComponent.component_type?.schema?.properties && 
                Object.entries(selectedComponent.component_type.schema.properties).map(([key, prop]: [string, any]) => {
                  const parsedProps = parseProps(selectedComponent.props);
                  return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {prop.title || key}
                    </label>
                    {prop.type === 'string' && prop.enum ? (
                      <select
                        value={parsedProps[key] !== undefined ? parsedProps[key] : (prop.default || '')}
                        onChange={(e) => onUpdateComponent(selectedComponent.id, { 
                          props: { ...parsedProps, [key]: e.target.value }
                        })}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      >
                        {prop.enum.map((option: string) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : prop.format === 'textarea' ? (
                      <textarea
                        value={parsedProps[key] !== undefined ? parsedProps[key] : (prop.default || '')}
                        onChange={(e) => onUpdateComponent(selectedComponent.id, { 
                          props: { ...parsedProps, [key]: e.target.value }
                        })}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        rows={3}
                        placeholder={prop.description}
                      />
                    ) : (
                      <input
                        type={prop.type === 'number' ? 'number' : 'text'}
                        value={parsedProps[key] !== undefined ? parsedProps[key] : (prop.default || '')}
                        onChange={(e) => onUpdateComponent(selectedComponent.id, { 
                          props: { ...parsedProps, [key]: e.target.value }
                        })}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        placeholder={prop.description}
                      />
                    )}
                    {prop.description && (
                      <p className="text-xs text-gray-500 mt-1">{prop.description}</p>
                    )}
                  </div>
                  );
                })
              }
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default DragDropPageBuilder;