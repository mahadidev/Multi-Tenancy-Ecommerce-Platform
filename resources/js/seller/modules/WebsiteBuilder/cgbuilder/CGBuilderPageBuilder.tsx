import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useStore from '../../../_hooks/useStore';
import { CGBuilderLayout } from './CGBuilderLayout';
import { UnifiedPageBuilder } from '../components/UnifiedPageBuilder';
import {
  useGetWebsiteQuery,
  useGetPageQuery,
  useGetWebsitesQuery,
  useGetPagesQuery,
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

export function CGBuilderPageBuilder() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { store } = useStore();
  
  const { selectedComponent } = useSelector((state: RootState) => state.websiteBuilder);
  
  // Parse pageId parameter
  const pageIdNum = pageId && !isNaN(parseInt(pageId, 10)) ? parseInt(pageId, 10) : 0;

  // API queries
  const { data: pageData, isLoading: pageLoading } = useGetPageQuery(
    pageIdNum,
    { skip: pageIdNum === 0 }
  );
  
  const { data: componentTypesData, isLoading: componentTypesLoading } = useGetComponentTypesQuery();
  
  // Mutations
  const [addComponent] = useAddComponentMutation();
  const [updateComponent] = useUpdateComponentMutation();
  const [deleteComponent] = useDeleteComponentMutation();
  const [createSection] = useCreateSectionMutation();

  // Local state
  const [isSaving, setIsSaving] = useState(false);

  // Get pages for current website (automatically use store's website)
  const { data: pagesData, isLoading: pagesLoading } = useGetPagesQuery();

  // Set current page when data loads
  useEffect(() => {
    if (pageData?.data) {
      dispatch(setCurrentPage(pageData.data));
    }
  }, [pageData, dispatch]);

  // Extract data
  const page = pageData?.data;
  const componentTypes = componentTypesData?.data || [];
  const pages = pagesData?.data || [];

  // Create a default section if none exists
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
        props: JSON.stringify({}),
        styles: JSON.stringify({}),
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
      if (updates.props) {
        dispatch(updateComponentProps({ componentId, props: updates.props }));
      }

      const serverData = { ...updates };
      const jsonFields = ['props', 'styles', 'responsive_settings', 'animation_settings', 'meta_data'];
      
      jsonFields.forEach(field => {
        if (serverData[field] && typeof serverData[field] === 'object') {
          serverData[field] = JSON.stringify(serverData[field]);
        }
      });

      const result = await updateComponent({
        id: componentId,
        data: serverData,
      }).unwrap();
      
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
  if (pageLoading || componentTypesLoading) {
    return (
      <CGBuilderLayout title="Page Builder">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </CGBuilderLayout>
    );
  }


  // Handle when no page is specified - show page selector for current website
  if (pageIdNum === 0) {
    return (
      <CGBuilderLayout title="Page Builder">
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Select Page to Edit
            </h1>
            <p className="text-gray-600">
              Choose a page to start building with CG Builder
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pages</h2>
            </div>
            
            {pagesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading pages...</span>
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No pages found</h3>
                <p className="text-gray-600">This website doesn't have any pages yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => navigate(`/cg-builder/page/${page.id}`)}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 mb-1">
                          {page.title}
                        </h3>
                        {page.slug && (
                          <p className="text-sm text-gray-500 mb-2">/{page.slug}</p>
                        )}
                        <div className="flex items-center space-x-3 text-xs text-gray-400">
                          <span className={`px-2 py-1 rounded-full ${
                            page.is_published 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {page.is_published ? 'Published' : 'Draft'}
                          </span>
                          {page.updated_at && (
                            <span>Updated {new Date(page.updated_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-blue-600 font-medium">
                          Unified Builder
                        </span>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/cg-builder')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to CG Builder Dashboard
            </button>
          </div>
        </div>
      </CGBuilderLayout>
    );
  }

  // Handle errors - check for data availability after loading
  if (!pageLoading && !page) {
    return (
      <CGBuilderLayout title="Page Builder">
        <div className="text-center py-12">
          <p className="text-gray-600">Page not found.</p>
          <p className="text-sm text-gray-500 mt-2">
            Page ID: {pageId}
          </p>
          <button
            onClick={() => navigate('/cg-builder')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to CG Builder
          </button>
        </div>
      </CGBuilderLayout>
    );
  }

  return (
    <CGBuilderLayout title="Page Builder">
      <div className="h-[calc(100vh-80px)]">
        <UnifiedPageBuilder 
          componentTypes={componentTypes}
          sections={page.sections || []}
          pageId={pageId}
          pageData={page} 
          onDropComponent={handleDropComponent}
          onUpdateComponent={handleUpdateComponent}
          onDeleteComponent={handleDeleteComponent}
          onSelectComponent={handleSelectComponent}
          selectedComponent={selectedComponent}
          onSave={(data) => {
            console.log('Page saved successfully:', data);
          }}
          onExit={() => {
            navigate('/cg-builder');
          }}
        />
      </div>
    </CGBuilderLayout>
  );
}