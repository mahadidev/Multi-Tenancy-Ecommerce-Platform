import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DragDropPageBuilder from '../components/DragDropPageBuilder';
import {
  useGetWebsiteQuery,
  useGetPageQuery,
  useGetComponentTypesQuery,
  useAddComponentMutation,
  useUpdateComponentMutation,
  useDeleteComponentMutation,
  useCreateSectionMutation,
} from '../store/websiteBuilderApi';
import {
  setCurrentWebsite,
  setCurrentPage,
  setSelectedComponent,
  updateComponentProps,
} from '../store/websiteBuilderSlice';
import type { RootState } from '../../../store/store';
import type { PageComponent } from '../types';

const WebsiteBuilderPage: React.FC = () => {
  const { websiteId, pageId } = useParams<{ websiteId: string; pageId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedComponent } = useSelector((state: RootState) => state.websiteBuilder);
  
  // Parse parameters safely - always use consistent values for hooks
  const websiteIdNum = websiteId && !isNaN(parseInt(websiteId, 10)) ? parseInt(websiteId, 10) : 0;
  const pageIdNum = pageId && !isNaN(parseInt(pageId, 10)) ? parseInt(pageId, 10) : 0;

  // API queries - always call hooks in the same order
  const { data: websiteData, isLoading: websiteLoading } = useGetWebsiteQuery(
    websiteIdNum,
    { skip: websiteIdNum === 0 }
  );
  
  const { data: pageData, isLoading: pageLoading } = useGetPageQuery(
    { websiteId: websiteIdNum, pageId: pageIdNum },
    { skip: websiteIdNum === 0 || pageIdNum === 0 }
  );
  
  const { data: componentTypesData, isLoading: componentTypesLoading } = useGetComponentTypesQuery();
  
  // Mutations
  const [addComponent] = useAddComponentMutation();
  const [updateComponent] = useUpdateComponentMutation();
  const [deleteComponent] = useDeleteComponentMutation();
  const [createSection] = useCreateSectionMutation();

  // Local state
  const [isSaving, setIsSaving] = useState(false);

  // Set current website and page when data loads
  useEffect(() => {
    if (websiteData?.data) {
      dispatch(setCurrentWebsite(websiteData.data));
    }
  }, [websiteData, dispatch]);

  useEffect(() => {
    if (pageData?.data) {
      dispatch(setCurrentPage(pageData.data));
    }
  }, [pageData, dispatch]);

  // Extract data
  const website = websiteData?.data;
  const page = pageData?.data;
  const componentTypes = componentTypesData?.data || [];

  // Create a default section if none exists - MUST be before any returns
  const ensureDefaultSection = useCallback(async () => {
    if (!page?.sections || page.sections.length === 0) {
      try {
        await createSection({
          pageId: page.id,
          data: {
            name: 'Main Content',
            type: 'section',
            sort_order: 0,
            is_visible: true,
          },
        }).unwrap();
      } catch (error) {
        console.error('Failed to create default section:', error);
      }
    }
  }, [page?.id, page?.sections, createSection]);

  // Handle dropping a component onto a section
  const handleDropComponent = useCallback(async (componentTypeId: number, sectionId: number, position: number) => {
    try {
      setIsSaving(true);
      
      await addComponent({
        section_id: sectionId,
        component_type_id: componentTypeId,
        sort_order: position,
        is_visible: true,
        props: JSON.stringify({}), // Default empty props as JSON string
        styles: JSON.stringify({}), // Default empty styles as JSON string
      }).unwrap();
      
      console.log('Component added successfully');
    } catch (error) {
      console.error('Failed to add component:', error);
    } finally {
      setIsSaving(false);
    }
  }, [addComponent]);

  // Handle updating component properties
  const handleUpdateComponent = useCallback(async (componentId: number, updates: Partial<PageComponent>) => {
    try {
      // Update local state immediately for better UX
      if (updates.props) {
        dispatch(updateComponentProps({ componentId, props: updates.props }));
      }

      // Prepare data for server - serialize JSON fields
      const serverData = { ...updates };
      const jsonFields = ['props', 'styles', 'responsive_settings', 'animation_settings', 'meta_data'];
      
      jsonFields.forEach(field => {
        if (serverData[field] && typeof serverData[field] === 'object') {
          serverData[field] = JSON.stringify(serverData[field]);
        }
      });

      // Save to server
      const result = await updateComponent({
        id: componentId,
        data: serverData,
      }).unwrap();
      
      // Update the selected component if it's the one we just updated
      if (selectedComponent?.id === componentId && result.data) {
        dispatch(setSelectedComponent(result.data));
      }
      
    } catch (error) {
      console.error('Failed to update component:', error);
    }
  }, [dispatch, updateComponent, selectedComponent]);

  // Handle deleting a component
  const handleDeleteComponent = useCallback(async (componentId: number) => {
    if (!confirm('Are you sure you want to delete this component?')) {
      return;
    }

    try {
      await deleteComponent(componentId).unwrap();
      
      // Clear selection if the deleted component was selected
      if (selectedComponent?.id === componentId) {
        dispatch(setSelectedComponent(null));
      }
      
    } catch (error) {
      console.error('Failed to delete component:', error);
    }
  }, [deleteComponent, selectedComponent?.id, dispatch]);

  // Handle selecting a component
  const handleSelectComponent = useCallback((component: PageComponent) => {
    dispatch(setSelectedComponent(component));
  }, [dispatch]);

  // Ensure there's at least one section
  useEffect(() => {
    if (page?.id) {
      ensureDefaultSection();
    }
  }, [page?.id, ensureDefaultSection]);

  // Handle loading states
  if (websiteLoading || pageLoading || componentTypesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Handle errors - check for data availability after loading
  if ((!websiteLoading && !pageLoading) && (websiteIdNum === 0 || pageIdNum === 0 || !website || !page)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Website or page not found.</p>
        <p className="text-sm text-gray-500 mt-2">
          {(websiteIdNum === 0 || !website) && "Website not found"} {(pageIdNum === 0 || !page) && "Page not found"}
        </p>
        <button
          onClick={() => navigate('/websites')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Websites
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <button
                onClick={() => navigate('/websites')}
                className="hover:text-gray-700"
              >
                Websites
              </button>
              <span>/</span>
              <button
                onClick={() => navigate('/websites')}
                className="hover:text-gray-700"
              >
                {website.title}
              </button>
              <span>/</span>
              <span className="text-gray-900">{page.title}</span>
            </nav>
            <h1 className="text-xl font-semibold text-gray-900 mt-1">
              Page Builder - {page.title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {isSaving && (
              <span className="text-sm text-gray-600">Saving...</span>
            )}
            
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
              Preview
            </button>
            
            <button
              onClick={() => navigate('/websites')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Page Builder */}
      <div className="flex-1 overflow-hidden">
        <DragDropPageBuilder
          componentTypes={componentTypes}
          sections={page.sections || []}
          onDropComponent={handleDropComponent}
          onUpdateComponent={handleUpdateComponent}
          onDeleteComponent={handleDeleteComponent}
          onSelectComponent={handleSelectComponent}
          selectedComponent={selectedComponent}
        />
      </div>
    </div>
  );
};

export default WebsiteBuilderPage;