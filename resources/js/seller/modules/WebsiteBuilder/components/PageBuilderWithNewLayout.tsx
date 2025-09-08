import React, { useState } from 'react';
import { BuilderLayout } from '../../../components/Layout/BuilderLayout';
import { ComponentSelector } from '../../../components/builder/ComponentSelector';
import { 
  SettingsPanel, 
  SettingsSection, 
  TextInput, 
  TextareaInput, 
  SelectInput, 
  ColorInput, 
  ToggleInput 
} from '../../../components/builder/SettingsPanel';
import type { ComponentType, PageComponent, PageSection } from '../types';

interface PageBuilderProps {
  sections: PageSection[];
  onUpdateComponent: (componentId: number, props: Record<string, any>) => void;
  onDeleteComponent: (componentId: number) => void;
  onAddComponent: (componentType: string, sectionId: number) => void;
}

export function PageBuilderWithNewLayout({ 
  sections, 
  onUpdateComponent, 
  onDeleteComponent, 
  onAddComponent 
}: PageBuilderProps) {
  const [selectedComponent, setSelectedComponent] = useState<PageComponent | null>(null);
  const [showComponentSelector, setShowComponentSelector] = useState(false);
  const [targetSection, setTargetSection] = useState<number | null>(null);

  const handleSelectComponent = (component: PageComponent) => {
    setSelectedComponent(component);
    setShowComponentSelector(false);
  };

  const handleAddComponentClick = (sectionId: number) => {
    setTargetSection(sectionId);
    setShowComponentSelector(true);
    setSelectedComponent(null);
  };

  const handleComponentSelect = (component: { id: string; name: string }) => {
    if (targetSection) {
      onAddComponent(component.id, targetSection);
      setShowComponentSelector(false);
      setTargetSection(null);
    }
  };

  const handleUpdateComponentProp = (key: string, value: any) => {
    if (selectedComponent) {
      const updatedProps = { ...selectedComponent.props, [key]: value };
      onUpdateComponent(selectedComponent.id, updatedProps);
      setSelectedComponent({ ...selectedComponent, props: updatedProps });
    }
  };

  // Settings panel content based on selected component
  const renderSettingsPanel = () => {
    if (!selectedComponent) {
      return (
        <SettingsPanel title="Page Settings">
          <SettingsSection title="General">
            <TextInput 
              label="Page Title" 
              value="" 
              onChange={(value) => {}} 
              placeholder="Enter page title" 
            />
            <TextareaInput 
              label="Meta Description" 
              value="" 
              onChange={(value) => {}} 
              placeholder="Enter meta description" 
            />
          </SettingsSection>
          
          <SettingsSection title="SEO">
            <TextInput 
              label="SEO Keywords" 
              value="" 
              onChange={(value) => {}} 
              placeholder="Enter keywords" 
            />
            <ToggleInput 
              label="Index Page" 
              value={true} 
              onChange={(value) => {}} 
            />
          </SettingsSection>
        </SettingsPanel>
      );
    }

    return (
      <SettingsPanel title={`${selectedComponent.name || 'Component'} Settings`}>
        <SettingsSection title="Content">
          {selectedComponent.component_type?.slug === 'hero-section' && (
            <>
              <TextInput 
                label="Title" 
                value={selectedComponent.props?.title || ''} 
                onChange={(value) => handleUpdateComponentProp('title', value)} 
                placeholder="Enter title" 
              />
              <TextInput 
                label="Subtitle" 
                value={selectedComponent.props?.subtitle || ''} 
                onChange={(value) => handleUpdateComponentProp('subtitle', value)} 
                placeholder="Enter subtitle" 
              />
              <TextareaInput 
                label="Description" 
                value={selectedComponent.props?.description || ''} 
                onChange={(value) => handleUpdateComponentProp('description', value)} 
                placeholder="Enter description" 
              />
              <TextInput 
                label="Button Text" 
                value={selectedComponent.props?.button_text || ''} 
                onChange={(value) => handleUpdateComponentProp('button_text', value)} 
                placeholder="Enter button text" 
              />
              <TextInput 
                label="Button Link" 
                value={selectedComponent.props?.button_link || ''} 
                onChange={(value) => handleUpdateComponentProp('button_link', value)} 
                placeholder="Enter button link" 
              />
            </>
          )}
          
          {selectedComponent.component_type?.slug === 'text-block' && (
            <>
              <TextInput 
                label="Heading" 
                value={selectedComponent.props?.heading || ''} 
                onChange={(value) => handleUpdateComponentProp('heading', value)} 
                placeholder="Enter heading" 
              />
              <TextareaInput 
                label="Content" 
                value={selectedComponent.props?.content || ''} 
                onChange={(value) => handleUpdateComponentProp('content', value)} 
                placeholder="Enter content" 
              />
            </>
          )}
        </SettingsSection>

        <SettingsSection title="Styling">
          <ColorInput 
            label="Background Color" 
            value={selectedComponent.props?.background_color || '#ffffff'} 
            onChange={(value) => handleUpdateComponentProp('background_color', value)} 
          />
          <SelectInput 
            label="Text Alignment" 
            value={selectedComponent.props?.text_align || 'left'} 
            onChange={(value) => handleUpdateComponentProp('text_align', value)} 
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' }
            ]} 
          />
        </SettingsSection>

        <SettingsSection title="Actions">
          <button 
            onClick={() => onDeleteComponent(selectedComponent.id)}
            className="w-full px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
          >
            Delete Component
          </button>
        </SettingsSection>
      </SettingsPanel>
    );
  };

  return (
    <BuilderLayout
      title="Page Builder"
      settingsPanel={renderSettingsPanel()}
      componentSelector={
        <ComponentSelector onSelectComponent={handleComponentSelect} />
      }
      showComponentSelector={showComponentSelector}
    >
      {/* Main Preview Area */}
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-32"
            >
              <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">
                    Section: {section.name || 'Unnamed Section'}
                  </h3>
                  <button
                    onClick={() => handleAddComponentClick(section.id)}
                    className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                  >
                    Add Component
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {section.components && section.components.length > 0 ? (
                  section.components.map((component) => (
                    <div 
                      key={component.id}
                      onClick={() => handleSelectComponent(component)}
                      className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                        selectedComponent?.id === component.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {component.component_type?.name || component.name || 'Unnamed Component'}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {component.component_type?.description || 'No description available'}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteComponent(component.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Component Preview */}
                      <div className="mt-3 p-3 bg-white rounded border">
                        <ComponentPreview component={component} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📦</div>
                    <p>No components yet. Click "Add Component" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {sections.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg">No sections available. Create a section first.</p>
            </div>
          )}
        </div>
      </div>
    </BuilderLayout>
  );
}

// Simple component preview
function ComponentPreview({ component }: { component: PageComponent }) {
  const componentType = component.component_type?.slug;
  const props = component.props || {};
  
  switch (componentType) {
    case 'hero-section':
      return (
        <div className="text-center p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded">
          <h1 className="text-2xl font-bold mb-2">{props.title || 'Hero Title'}</h1>
          <p className="text-lg mb-4">{props.subtitle || 'Hero Subtitle'}</p>
          <p className="mb-4">{props.description || 'Hero description goes here'}</p>
          <button className="px-4 py-2 bg-white text-blue-600 rounded">
            {props.button_text || 'Get Started'}
          </button>
        </div>
      );
      
    case 'text-block':
      return (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">{props.heading || 'Text Block Heading'}</h2>
          <p className="text-gray-600">{props.content || 'Text content goes here...'}</p>
        </div>
      );
      
    default:
      return (
        <div className="p-4 text-center text-gray-500">
          <div className="text-2xl mb-2">🔧</div>
          <p>Component Preview</p>
          <p className="text-xs">{componentType || 'Unknown Component'}</p>
        </div>
      );
  }
}