import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface MenuItem {
  id?: number;
  title: string;
  url: string;
  type: 'page' | 'product' | 'category' | 'external' | 'custom';
  target: '_self' | '_blank';
  parent_id?: number | null;
  sort_order: number;
  is_active: boolean;
}

interface MenuBuilderProps {
  menu?: any;
  onSave: (menuData: any) => void;
  onCancel: () => void;
}

const MenuBuilder: React.FC<MenuBuilderProps> = ({ menu, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: 'header' as 'header' | 'footer' | 'sidebar' | 'mobile',
    is_active: true,
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    title: '',
    url: '',
    type: 'custom',
    target: '_self',
    is_active: true,
  });

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name || '',
        location: menu.location || 'header',
        is_active: menu.is_active ?? true,
      });
      setMenuItems(menu.items || []);
    }
  }, [menu]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const menuData = {
      ...formData,
      items: menuItems.map((item, index) => ({
        ...item,
        sort_order: index + 1,
      })),
    };
    
    onSave(menuData);
  };

  const addMenuItem = () => {
    if (!newItem.title || !newItem.url) return;
    
    const item: MenuItem = {
      id: Date.now(), // Temporary ID for frontend
      title: newItem.title,
      url: newItem.url,
      type: newItem.type || 'custom',
      target: newItem.target || '_self',
      sort_order: menuItems.length + 1,
      is_active: newItem.is_active ?? true,
    };
    
    setMenuItems(prev => [...prev, item]);
    setNewItem({
      title: '',
      url: '',
      type: 'custom',
      target: '_self',
      is_active: true,
    });
    setShowAddForm(false);
  };

  const removeMenuItem = (index: number) => {
    setMenuItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateMenuItem = (index: number, field: keyof MenuItem, value: any) => {
    setMenuItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMenuItems(items);
  };

  const getUrlPlaceholder = (type: string) => {
    const placeholders: Record<string, string> = {
      page: '/about-us',
      product: '/products/product-name',
      category: '/category/category-name',
      external: 'https://example.com',
      custom: '/custom-page',
    };
    return placeholders[type] || '/';
  };

  const menuTypes = [
    { value: 'page', label: 'Page' },
    { value: 'product', label: 'Product' },
    { value: 'category', label: 'Category' },
    { value: 'external', label: 'External Link' },
    { value: 'custom', label: 'Custom' },
  ];

  const locations = [
    { value: 'header', label: 'Header' },
    { value: 'footer', label: 'Footer' },
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'mobile', label: 'Mobile Menu' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Menu Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="menu_name" className="block text-sm font-medium text-gray-700 mb-2">
            Menu Name
          </label>
          <input
            type="text"
            id="menu_name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Main Menu"
            required
          />
        </div>

        <div>
          <label htmlFor="menu_location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            id="menu_location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {locations.map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Menu is active
          </span>
        </label>
      </div>

      {/* Menu Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Menu Items</h3>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Add Menu Item</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newItem.title || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Menu item title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newItem.type || 'custom'}
                  onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {menuTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={newItem.url || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={getUrlPlaceholder(newItem.type || 'custom')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target
                </label>
                <select
                  value={newItem.target || '_self'}
                  onChange={(e) => setNewItem(prev => ({ ...prev, target: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="_self">Same window</option>
                  <option value="_blank">New window</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addMenuItem}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Item
              </button>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        {menuItems.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No menu items added yet</p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Your First Menu Item
            </button>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="menu-items">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {menuItems.map((item, index) => (
                    <Draggable
                      key={item.id || index}
                      draggableId={String(item.id || index)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white border border-gray-200 rounded-lg p-4 ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move text-gray-400 hover:text-gray-600"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                              </div>
                              
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => updateMenuItem(index, 'title', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Menu title"
                                />
                                
                                <input
                                  type="text"
                                  value={item.url}
                                  onChange={(e) => updateMenuItem(index, 'url', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="URL"
                                />
                                
                                <select
                                  value={item.type}
                                  onChange={(e) => updateMenuItem(index, 'type', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  {menuTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-3">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={item.is_active}
                                  onChange={(e) => updateMenuItem(index, 'is_active', e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-1 text-xs text-gray-600">Active</span>
                              </label>
                              
                              <button
                                type="button"
                                onClick={() => removeMenuItem(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {menu ? 'Update Menu' : 'Create Menu'}
        </button>
      </div>
    </form>
  );
};

export default MenuBuilder;