import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetWebsiteMenusQuery,
  useCreateWebsiteMenuMutation,
  useUpdateWebsiteMenuMutation,
  useDeleteWebsiteMenuMutation,
} from '../store/websiteBuilderApi';
import MenuBuilder from '../components/menu/MenuBuilder';

const WebsiteMenusPage: React.FC = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const websiteIdNum = websiteId ? parseInt(websiteId, 10) : 0;

  // API queries
  const { data: menusData, isLoading, refetch } = useGetWebsiteMenusQuery(
    websiteIdNum,
    { skip: websiteIdNum === 0 }
  );

  // Mutations
  const [createMenu] = useCreateWebsiteMenuMutation();
  const [updateMenu] = useUpdateWebsiteMenuMutation();
  const [deleteMenu] = useDeleteWebsiteMenuMutation();

  const menus = menusData?.data || [];

  const handleCreateMenu = async (menuData: any) => {
    try {
      await createMenu({
        websiteId: websiteIdNum,
        data: menuData,
      }).unwrap();
      refetch();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create menu:', error);
    }
  };

  const handleUpdateMenu = async (menuData: any) => {
    if (!selectedMenu) return;
    
    try {
      await updateMenu({
        websiteId: websiteIdNum,
        menuId: selectedMenu.id,
        data: menuData,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update menu:', error);
    }
  };

  const handleDeleteMenu = async (menuId: number) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;
    
    try {
      await deleteMenu({
        websiteId: websiteIdNum,
        menuId,
      }).unwrap();
      refetch();
      if (selectedMenu?.id === menuId) {
        setSelectedMenu(null);
      }
    } catch (error) {
      console.error('Failed to delete menu:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading menus...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/websites')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← Back to Websites
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Website Menus
              </h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create New Menu
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Menus</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {menus.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-4">No menus created yet</p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Create Your First Menu
                    </button>
                  </div>
                ) : (
                  menus.map((menu: any) => (
                    <div
                      key={menu.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedMenu?.id === menu.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedMenu(menu)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{menu.name}</h3>
                          <p className="text-xs text-gray-500 capitalize">{menu.location}</p>
                          <p className="text-xs text-gray-400">
                            {menu.items?.length || 0} items
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            menu.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {menu.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMenu(menu.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Menu Editor */}
          <div className="lg:col-span-2">
            {showCreateForm ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Create New Menu</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  <MenuBuilder
                    onSave={handleCreateMenu}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </div>
              </div>
            ) : selectedMenu ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Edit Menu: {selectedMenu.name}
                  </h2>
                </div>
                <div className="p-6">
                  <MenuBuilder
                    menu={selectedMenu}
                    onSave={handleUpdateMenu}
                    onCancel={() => setSelectedMenu(null)}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a menu to edit
                  </h3>
                  <p className="text-gray-500">
                    Choose a menu from the list on the left to start editing, or create a new menu.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteMenusPage;