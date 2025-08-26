import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button, Modal, Badge, Tooltip } from 'flowbite-react';
import { 
  HiPlus, HiTrash, HiDuplicate, HiEye, HiEyeOff, HiCog, 
  HiSave, HiDesktopComputer, HiDeviceMobile, HiDeviceTablet,
  HiArrowUp, HiArrowDown, HiTemplate, HiPhotograph, HiShoppingCart,
  HiMenuAlt2, HiViewGrid, HiSpeakerphone
} from 'react-icons/hi';
import { useParams } from 'react-router-dom';
import { 
  useGetSectionsQuery, 
  useCreateSectionMutation, 
  useUpdateSectionMutation, 
  useDeleteSectionMutation,
  useAddComponentMutation,
  useUpdateComponentMutation,
  useDeleteComponentMutation,
  useGetComponentTypesQuery 
} from '../store/websiteBuilderApi';
import type { PageSection, PageComponent, ComponentType } from '../types';

interface LocalComponentType {
  id: string;
  name: string;
  type: string;
  category: string;
  icon: React.ComponentType;
  description: string;
  defaultProps: Record<string, any>;
}

const COMPONENT_CATEGORIES = {
  layout: { name: 'Layout', icon: HiTemplate, color: 'blue' },
  hero: { name: 'Hero', icon: HiPhotograph, color: 'purple' },
  products: { name: 'Products', icon: HiShoppingCart, color: 'green' },
  content: { name: 'Content', icon: HiMenuAlt2, color: 'yellow' },
  ecommerce: { name: 'E-commerce', icon: HiShoppingCart, color: 'red' },
  marketing: { name: 'Marketing', icon: HiSpeakerphone, color: 'pink' }
};

const AVAILABLE_COMPONENTS: LocalComponentType[] = [
  // Hero Components
  {
    id: '1',
    name: 'Hero Banner',
    type: 'hero-banner',
    category: 'hero',
    icon: HiPhotograph,
    description: 'Full-width hero section with CTA',
    defaultProps: {
      title: 'Welcome to Our Store',
      subtitle: 'Discover amazing products',
      backgroundImage: '/api/placeholder/1920/600',
      primaryButtonText: 'Shop Now',
      primaryButtonLink: '/products'
    }
  },
  {
    id: '2',
    name: 'Hero Slider',
    type: 'hero-slider',
    category: 'hero',
    icon: HiPhotograph,
    description: 'Image carousel with multiple slides',
    defaultProps: {
      slides: [],
      autoplay: true,
      interval: 5000
    }
  },
  // Product Components
  {
    id: '3',
    name: 'Product Grid',
    type: 'product-grid',
    category: 'products',
    icon: HiViewGrid,
    description: 'Display products in a grid layout',
    defaultProps: {
      title: 'Featured Products',
      columns: 4,
      rows: 2,
      filter: 'featured'
    }
  },
  {
    id: '4',
    name: 'Product Carousel',
    type: 'product-carousel',
    category: 'products',
    icon: HiViewGrid,
    description: 'Scrolling product carousel',
    defaultProps: {
      title: 'You May Also Like',
      itemsToShow: 4,
      autoplay: false
    }
  },
];

const DraggableComponent: React.FC<{ component: LocalComponentType }> = ({ component }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: component,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const Icon = component.icon;

  return (
    <div
      ref={drag}
      className={`p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 cursor-move transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{component.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{component.description}</p>
        </div>
      </div>
    </div>
  );
};

const PageSectionComponent: React.FC<{
  section: PageSection;
  onUpdateComponent: (id: number, updates: Partial<PageComponent>) => void;
  onDeleteComponent: (id: number) => void;
  onDuplicateComponent: (id: number) => void;
  onMoveComponent: (id: number, direction: 'up' | 'down') => void;
}> = ({ section, onUpdateComponent, onDeleteComponent, onDuplicateComponent, onMoveComponent }) => {
  const [showSettings, setShowSettings] = useState(false);
  
  // Get the first component in the section (simplified for now)
  const component = section.components?.[0];
  
  
  if (!component?.component_type) return null;

  const localComponent = AVAILABLE_COMPONENTS.find(c => c.type === component.component_type!.slug);
  if (!localComponent) return null;

  const Icon = localComponent.icon;

  return (
    <div className={`group relative p-4 bg-white dark:bg-gray-800 rounded-lg border-2 ${
      component.is_visible ? 'border-gray-200 dark:border-gray-700' : 'border-gray-300 dark:border-gray-600 opacity-50'
    } hover:border-blue-500 transition-all`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{localComponent.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{localComponent.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip content="Move Up">
            <Button
              size="xs"
              color="gray"
              onClick={() => onMoveComponent(component.id, 'up')}
            >
              <HiArrowUp className="w-4 h-4" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Move Down">
            <Button
              size="xs"
              color="gray"
              onClick={() => onMoveComponent(component.id, 'down')}
            >
              <HiArrowDown className="w-4 h-4" />
            </Button>
          </Tooltip>
          
          <Tooltip content={component.is_visible ? 'Hide' : 'Show'}>
            <Button
              size="xs"
              color="gray"
              onClick={() => onUpdateComponent(component.id, { is_visible: !component.is_visible })}
            >
              {component.is_visible ? <HiEye className="w-4 h-4" /> : <HiEyeOff className="w-4 h-4" />}
            </Button>
          </Tooltip>
          
          <Tooltip content="Settings">
            <Button
              size="xs"
              color="gray"
              onClick={() => setShowSettings(true)}
            >
              <HiCog className="w-4 h-4" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Duplicate">
            <Button
              size="xs"
              color="gray"
              onClick={() => onDuplicateComponent(component.id)}
            >
              <HiDuplicate className="w-4 h-4" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Delete">
            <Button
              size="xs"
              color="failure"
              onClick={() => onDeleteComponent(component.id)}
            >
              <HiTrash className="w-4 h-4" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Component Settings Modal */}
      <Modal show={showSettings} onClose={() => setShowSettings(false)} size="xl">
        <Modal.Header>{localComponent.name} Settings</Modal.Header>
        <Modal.Body>
          <ComponentSettings
            component={localComponent}
            props={component.props || {}}
            onUpdate={(props) => {
              onUpdateComponent(component.id, { props });
              setShowSettings(false);
            }}
            onClose={() => setShowSettings(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

const ComponentSettings: React.FC<{
  component: LocalComponentType;
  props: Record<string, any>;
  onUpdate: (props: Record<string, any>) => void;
  onClose?: () => void;
}> = ({ component, props, onUpdate, onClose }) => {
  // Initialize form data with API props merged with defaults
  const getInitialFormData = () => {
    console.log('=== getInitialFormData Debug ===', {
      propsReceived: props,
      propsKeys: Object.keys(props || {}),
      componentDefaultProps: component.defaultProps,
      componentDefaultPropsKeys: Object.keys(component.defaultProps || {}),
      title: {
        fromProps: props?.title,
        fromDefaults: component.defaultProps?.title,
        final: props?.title || component.defaultProps?.title || 'Default Title'
      }
    });

    return {
      title: props?.title || component.defaultProps?.title || 'Default Title',
      subtitle: props?.subtitle || component.defaultProps?.subtitle || 'Default Subtitle',
      backgroundImage: props?.backgroundImage || component.defaultProps?.backgroundImage || '/default-image.jpg',
      primaryButtonText: props?.primaryButtonText || component.defaultProps?.primaryButtonText || 'Click Here',
      primaryButtonLink: props?.primaryButtonLink || component.defaultProps?.primaryButtonLink || '#'
    };
  };

  const [formData, setFormData] = useState(() => {
    const initialData = getInitialFormData();
    console.log('=== Initial Form Data ===', initialData);
    return initialData;
  });

  // Update form data when props change (after API save)
  useEffect(() => {
    console.log('=== useEffect Props Changed ===', {
      oldProps: 'see previous logs',
      newProps: props,
      propsStringified: JSON.stringify(props)
    });
    const newFormData = getInitialFormData();
    console.log('=== Setting new form data ===', { newFormData });
    setFormData(newFormData);
  }, [props, component.defaultProps]);

  const handleInputChange = (key: string, value: any) => {
    console.log('=== Input Changed ===', { key, value, oldFormData: formData });
    setFormData(prev => {
      const newData = { ...prev, [key]: value };
      console.log('=== New Form Data After Input ===', newData);
      return newData;
    });
  };

  const handleSave = () => {
    console.log('=== SAVING FORM DATA ===', {
      formDataToSave: formData,
      onUpdateFunction: onUpdate
    });
    onUpdate(formData);
    // Don't close immediately - let's see if props update
    // if (onClose) onClose();
  };

  const handleCancel = () => {
    // Reset to initial values from API props
    setFormData(getInitialFormData());
    if (onClose) onClose();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Component Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background Image
          </label>
          <input
            type="text"
            value={formData.backgroundImage}
            onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Primary Button Text
          </label>
          <input
            type="text"
            value={formData.primaryButtonText}
            onChange={(e) => handleInputChange('primaryButtonText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Primary Button Link
          </label>
          <input
            type="text"
            value={formData.primaryButtonLink}
            onChange={(e) => handleInputChange('primaryButtonLink', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Debug info */}
      <div className="mt-4 p-3 bg-blue-50 rounded text-xs">
        <strong>Debug - Current Form Data:</strong><br/>
        {JSON.stringify(formData, null, 2)}
      </div>

      {/* Debug info */}
      <div className="mt-2 p-3 bg-yellow-50 rounded text-xs">
        <strong>Debug - Received Props:</strong><br/>
        {JSON.stringify(props, null, 2)}
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button color="gray" onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

const PageBuilder: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const currentPageId = pageId ? parseInt(pageId) : 1; // Default to 1 if no pageId in URL
  
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // API Queries and Mutations
  const { data: sectionsData, isLoading: sectionsLoading, refetch: refetchSections } = useGetSectionsQuery(currentPageId);
  const [createSection] = useCreateSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [addComponent] = useAddComponentMutation();
  const [updateComponent] = useUpdateComponentMutation();
  const [deleteComponent] = useDeleteComponentMutation();
  
  const sections = sectionsData?.data || [];
  

  const [, drop] = useDrop({
    accept: 'component',
    drop: async (item: LocalComponentType) => {
      try {
        // Find the corresponding component type ID
        const componentTypeId = parseInt(item.id);
        
        // First create a section
        const sectionResult = await createSection({
          pageId: currentPageId,
          data: {
            name: `${item.name} Section`,
            type: 'default',
            sort_order: sections.length,
            is_visible: true
          }
        }).unwrap();
        
        // Then add the component to that section
        await addComponent({
          section_id: sectionResult.data.id,
          component_type_id: componentTypeId,
          name: item.name,
          props: item.defaultProps,
          is_visible: true,
          sort_order: 0
        }).unwrap();
        
        // Refetch sections to update the UI
        refetchSections();
      } catch (error) {
        console.error('Error adding component:', error);
      }
    },
  });

  const handleUpdateComponent = async (id: number, updates: Partial<PageComponent>) => {
    try {
      await updateComponent({
        id,
        data: updates
      }).unwrap();
      refetchSections();
    } catch (error) {
      console.error('Error updating component:', error);
    }
  };

  const handleDeleteComponent = async (id: number) => {
    try {
      await deleteComponent(id).unwrap();
      refetchSections();
    } catch (error) {
      console.error('Error deleting component:', error);
    }
  };

  const handleDuplicateComponent = async (id: number) => {
    try {
      // This would need a duplicate component endpoint or manual recreation
      console.log('Duplicate component:', id);
      // For now, just refetch
      refetchSections();
    } catch (error) {
      console.error('Error duplicating component:', error);
    }
  };

  const handleMoveComponent = async (id: number, direction: 'up' | 'down') => {
    try {
      // This would need move/reorder endpoint implementation
      console.log('Move component:', id, direction);
      // For now, just refetch
      refetchSections();
    } catch (error) {
      console.error('Error moving component:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Data is automatically saved via API mutations
      // This could trigger a publish action or show success message
      console.log('Page saved successfully');
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const filteredComponents = selectedCategory === 'all' 
    ? AVAILABLE_COMPONENTS 
    : AVAILABLE_COMPONENTS.filter(c => c.category === selectedCategory);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Left Sidebar - Components */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Components</h2>
            
            {/* Category Tabs */}
            <div className="mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Components</option>
                {Object.entries(COMPONENT_CATEGORIES).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Component List */}
            <div className="space-y-2">
              {filteredComponents.map(component => (
                <DraggableComponent key={component.id} component={component} />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Page Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Page Builder</h1>
                <Badge color="info">Page {currentPageId}</Badge>
              </div>

              <div className="flex items-center space-x-3">
                {/* Preview Mode Selector */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  >
                    <HiDesktopComputer className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  >
                    <HiDeviceTablet className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  >
                    <HiDeviceMobile className="w-5 h-5" />
                  </button>
                </div>

                <Button color="gray">
                  <HiEye className="mr-2 w-4 h-4" />
                  Preview
                </Button>

                <Button onClick={handleSave}>
                  <HiSave className="mr-2 w-4 h-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Page Canvas */}
          <div className="flex-1 overflow-y-auto p-6">
            <div
              ref={drop}
              className={`mx-auto transition-all ${
                previewMode === 'desktop' ? 'max-w-full' :
                previewMode === 'tablet' ? 'max-w-3xl' :
                'max-w-md'
              }`}
            >
              {sectionsLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading sections...</p>
                </div>
              ) : sections.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                  <HiTemplate className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Drag components here to start building</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Choose from the components panel on the left</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.sort((a, b) => a.sort_order - b.sort_order).map(section => (
                    <PageSectionComponent
                      key={section.id}
                      section={section}
                      onUpdateComponent={handleUpdateComponent}
                      onDeleteComponent={handleDeleteComponent}
                      onDuplicateComponent={handleDuplicateComponent}
                      onMoveComponent={handleMoveComponent}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Page Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  defaultValue="Home"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Page URL
                </label>
                <input
                  type="text"
                  defaultValue="/"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  placeholder="Enter SEO title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SEO Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter SEO description"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button size="sm" color="gray" className="w-full">
                  <HiDuplicate className="mr-2 w-4 h-4" />
                  Duplicate Page
                </Button>
                <Button size="sm" color="gray" className="w-full">
                  <HiTemplate className="mr-2 w-4 h-4" />
                  Save as Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default PageBuilder;