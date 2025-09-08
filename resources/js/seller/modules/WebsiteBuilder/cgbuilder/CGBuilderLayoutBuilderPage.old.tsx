import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useStore from '../../../_hooks/useStore';
import { CGBuilderLayout } from './CGBuilderLayout';
import { UnifiedPageBuilder } from '../components/UnifiedPageBuilder';
import {
  useGetWebsiteQuery,
  useGetHeaderQuery,
  useGetFooterQuery,
  useUpdateHeaderMutation,
  useUpdateFooterMutation,
  useGetComponentTypesQuery,
} from '../store/websiteBuilderApi';
import {
  setCurrentWebsite,
  setSelectedComponent,
} from '../store/websiteBuilderSlice';
import type { RootState } from '../../../store/store';
import type { PageComponent, PageSection } from '../types';

// Layout-specific component types
const HEADER_COMPONENT_TYPES = [
  'logo',
  'navigation',
  'search',
  'user-menu',
  'cart-icon',
  'cta-button',
  'language-switcher',
  'social-icons',
  'contact-info',
  'breadcrumb'
];

const FOOTER_COMPONENT_TYPES = [
  'logo',
  'links',
  'social-icons',
  'contact-info',
  'newsletter-signup',
  'copyright',
  'payment-methods',
  'legal-links',
  'company-info',
  'sitemap'
];

type LayoutType = 'header' | 'footer';

interface CGBuilderLayoutBuilderPageProps {
  type?: 'header' | 'footer';
}

export function CGBuilderLayoutBuilderPage({ type }: CGBuilderLayoutBuilderPageProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { store } = useStore();
  const [searchParams] = useSearchParams();
  
  // Get layout type from URL params
  const layoutType: LayoutType = (searchParams.get('type') as LayoutType) || 'header';
  
  const { selectedComponent } = useSelector((state: RootState) => state.websiteBuilder);
  
  // Use current store's website
  const websiteIdNum = store?.website?.id || 0;
  
  // API queries
  const { data: websiteData, isLoading: websiteLoading } = useGetWebsiteQuery(
    websiteIdNum,
    { skip: websiteIdNum === 0 }
  );
  
  const { data: headerData, isLoading: headerLoading, error: headerError } = useGetHeaderQuery(
    websiteIdNum,
    { skip: websiteIdNum === 0 || layoutType !== 'header' }
  );

  // Debug logging
  React.useEffect(() => {
    console.log('🏗️ Header Builder Debug Info:', {
      websiteIdNum,
      layoutType,
      headerData,
      headerLoading,
      headerError,
      storeWebsiteId: store?.website?.id,
      skipCondition: websiteIdNum === 0 || layoutType !== 'header'
    });
  }, [websiteIdNum, layoutType, headerData, headerLoading, headerError, store?.website?.id]);
  
  const { data: footerData, isLoading: footerLoading, error: footerError } = useGetFooterQuery(
    websiteIdNum,
    { skip: websiteIdNum === 0 || layoutType !== 'footer' }
  );

  // Additional debug for footer API call
  React.useEffect(() => {
    if (layoutType === 'footer') {
      console.log('🔍 Footer API Query Debug:', {
        'websiteIdNum': websiteIdNum,
        'skip condition': websiteIdNum === 0 || layoutType !== 'footer',
        'should make API call': websiteIdNum !== 0 && layoutType === 'footer',
        'footerData': footerData,
        'footerLoading': footerLoading,
        'footerError': footerError
      });
    }
  }, [websiteIdNum, layoutType, footerData, footerLoading, footerError]);

  // Debug logging for footer
  React.useEffect(() => {
    console.log('🦶 Footer Builder Debug Info:', {
      websiteIdNum,
      layoutType,
      footerData,
      footerLoading,
      footerError,
      storeWebsiteId: store?.website?.id,
      storeObject: store,
      skipCondition: websiteIdNum === 0 || layoutType !== 'footer',
      isFooterType: layoutType === 'footer',
      websiteIdCheck: websiteIdNum === 0,
      shouldSkip: websiteIdNum === 0 || layoutType !== 'footer',
      'store?.website': store?.website
    });
  }, [websiteIdNum, layoutType, footerData, footerLoading, footerError, store?.website?.id, store]);
  
  const { data: componentTypesData, isLoading: componentTypesLoading, error: componentTypesError } = useGetComponentTypesQuery();
  
  // Additional debug logging for component types API
  React.useEffect(() => {
    console.log('🔍 Component Types API Debug:', {
      isLoading: componentTypesLoading,
      hasData: !!componentTypesData,
      error: componentTypesError,
      dataStructure: componentTypesData ? {
        status: componentTypesData.status,
        dataLength: componentTypesData.data?.length,
        firstComponent: componentTypesData.data?.[0]
      } : null
    });
  }, [componentTypesData, componentTypesLoading, componentTypesError]);
  
  // Mutations
  const [updateHeader, { isLoading: isUpdatingHeader }] = useUpdateHeaderMutation();
  const [updateFooter, { isLoading: isUpdatingFooter }] = useUpdateFooterMutation();
  
  // Get the appropriate component types based on layout type
  const allComponentTypes = componentTypesData?.data || [];
  const layoutComponentTypes = Array.isArray(allComponentTypes) 
    ? allComponentTypes.filter((type: any) => {
        const targetTypes = layoutType === 'header' ? HEADER_COMPONENT_TYPES : FOOTER_COMPONENT_TYPES;
        return targetTypes.includes(type.name);
      })
    : [];
  
  // Debug component types filtering
  console.log('🧩 Component Types Debug:', {
    layoutType,
    allComponentTypesCount: allComponentTypes.length,
    allComponentTypesNames: allComponentTypes.map((t: any) => t.name),
    targetTypes: layoutType === 'header' ? HEADER_COMPONENT_TYPES : FOOTER_COMPONENT_TYPES,
    layoutComponentTypesCount: layoutComponentTypes.length,
    layoutComponentTypesNames: layoutComponentTypes.map((t: any) => t.name),
    componentTypesLoading: componentTypesLoading,
    componentTypesError: componentTypesError,
    componentTypesData: componentTypesData,
    rawApiData: componentTypesData?.data
  });
  
  // Get the appropriate data based on layout type
  const currentData = layoutType === 'header' ? headerData : footerData;
  
  // Convert layout data to sections format
  // The API returns data in different formats for header vs footer
  let layoutSections: PageSection[] = [];
  let elementorElements: any[] = [];
  
  if (layoutType === 'header') {
    // Header uses 'sections' or 'elements' format (Elementor-style)
    layoutSections = currentData?.data?.sections || [];
    elementorElements = currentData?.data?.elements || [];
  } else if (layoutType === 'footer') {
    // Footer supports both 'columns' (legacy single row) and 'rows' (multi-row) formats
    const footerRows = currentData?.data?.rows;
    const footerColumns = currentData?.data?.columns;
    
    if (footerRows && footerRows.length > 0) {
      // New multi-row format - convert rows to sections
      layoutSections = footerRows.map((row: any, rowIndex: number) => ({
        id: row.id || `footer-section-${rowIndex + 1}`,
        name: row.name || `Footer Row ${rowIndex + 1}`,
        type: 'section',
        sort_order: rowIndex,
        is_visible: true,
        components: [],
        columns: (row.columns || []).map((column: any, columnIndex: number) => ({
          id: column.id || `col-${columnIndex + 1}`,
          name: column.title || `Column ${columnIndex + 1}`,
          type: 'column',
          sort_order: columnIndex,
          is_visible: true,
          components: column.elements || [],
          settings: {
            desktop: {
              alignment: column.alignment || 'left',
              justifyContent: column.justifyContent || 'start',
              alignItems: column.alignItems || 'start',
              flexDirection: column.flexDirection || 'column',
              gap: column.gap || 'md'
            }
          }
        })),
        settings: {
          desktop: row.settings || {}
        }
      }));
    } else if (footerColumns && footerColumns.length > 0) {
      // Legacy single-row format - convert footer columns to a single section
      layoutSections = [{
        id: 'footer-section-1',
        name: 'Footer Row',
        type: 'section',
        sort_order: 0,
        is_visible: true,
        components: [],
        columns: footerColumns.map((column: any, index: number) => ({
          id: column.id || `col-${index + 1}`,
          name: column.title || `Column ${index + 1}`,
          type: 'column',
          sort_order: index,
          is_visible: true,
          components: column.elements || [],
          settings: {
            desktop: {
              alignment: column.alignment || 'left',
              justifyContent: column.justifyContent || 'start',
              alignItems: column.alignItems || 'start',
              flexDirection: column.flexDirection || 'column',
              gap: column.gap || 'md'
            }
          }
        })),
        settings: {
          desktop: currentData?.data?.settings || {}
        }
      }];
    }
  }
  
  // Debug current data
  console.log('📊 Layout Data Debug:', {
    currentData,
    layoutType,
    sectionsFromAPI: currentData?.data?.sections,
    elementsFromAPI: currentData?.data?.elements,
    columnsFromAPI: currentData?.data?.columns, // Add footer columns debug
    rowsFromAPI: currentData?.data?.rows, // Add footer rows debug
    settingsFromAPI: currentData?.data?.settings, // Add footer settings debug
    sectionsLength: layoutSections.length,
    elementsLength: elementorElements.length,
    processedSections: layoutSections // Show processed sections
  });
  
  // If we have elements but no sections, this is Elementor data that needs different handling
  // Note: Don't create default sections automatically - let users add them manually if needed
  
  // Loading state
  const isLoading = websiteLoading || headerLoading || footerLoading || componentTypesLoading;
  
  // Set current website in store
  useEffect(() => {
    if (websiteData?.data) {
      dispatch(setCurrentWebsite(websiteData.data));
    }
  }, [websiteData, dispatch]);
  
  // Handlers for layout builder
  const handleDropComponent = useCallback(async (componentTypeId: number, sectionId: number, position: number) => {
    try {
      console.log(`Drop ${layoutType} component:`, { componentTypeId, sectionId, position });
      // TODO: Implement actual component creation via API
    } catch (error) {
      console.error(`Failed to add ${layoutType} component:`, error);
    }
  }, [layoutType]);
  
  const handleUpdateComponent = useCallback(async (componentId: number, updates: any) => {
    try {
      console.log(`Update ${layoutType} component:`, { componentId, updates });
      // TODO: Implement actual component update via API
    } catch (error) {
      console.error(`Failed to update ${layoutType} component:`, error);
    }
  }, [layoutType]);
  
  const handleDeleteComponent = useCallback(async (componentId: number) => {
    try {
      console.log(`Delete ${layoutType} component:`, componentId);
      // TODO: Implement actual component deletion via API
    } catch (error) {
      console.error(`Failed to delete ${layoutType} component:`, error);
    }
  }, [layoutType]);
  
  const handleSelectComponent = useCallback((component: PageComponent) => {
    dispatch(setSelectedComponent(component));
  }, [dispatch]);
  
  const handleSave = useCallback(async (data: any) => {
    try {
      console.log(`Saving ${layoutType} with data:`, data);
      console.log('Data structure:', {
        hasSections: !!data.sections,
        sectionsCount: data.sections?.length,
        firstSection: data.sections?.[0],
        hasColumns: data.sections?.[0]?.columns,
        columnsCount: data.sections?.[0]?.columns?.length
      });
      
      // Prepare payload based on API requirements
      let payload;
      
      if (layoutType === 'header') {
        // Header API expects either 'elements' or 'columns' + 'settings'
        // We'll use elements format for now
        // Ensure elements is always an array, even when empty
        const sections = Array.isArray(data.sections) ? data.sections : [];
        payload = {
          elements: sections,
          settings: data.deviceSettings || {}
        };
      } else {
        // Footer API expects 'rows' structure for multiple sections
        // Need to extract rows from the sections structure
        const sections = Array.isArray(data.sections) ? data.sections : [];
        
        // Convert Elementor sections to footer rows format
        let footerRows = [];
        if (sections.length > 0) {
          // Process all sections as rows
          footerRows = sections.map((section, sectionIndex) => {
            const rowColumns = [];
            if (section.columns && Array.isArray(section.columns)) {
              rowColumns.push(...section.columns.map((column, columnIndex) => ({
                id: column.id || `row-${sectionIndex + 1}-col-${columnIndex + 1}`,
                title: column.settings?.desktop?._columnTitle || `Column ${columnIndex + 1}`,
                elements: column.widgets || [],
                alignment: column.settings?.desktop?.alignment || 'left',
                justifyContent: column.settings?.desktop?.justifyContent || 'start',
                alignItems: column.settings?.desktop?.alignItems || 'start',
                flexDirection: column.settings?.desktop?.flexDirection || 'column',
                gap: column.settings?.desktop?.gap || 'md'
              })));
            }
            
            return {
              id: section.id || `footer-row-${sectionIndex + 1}`,
              name: section.name || `Row ${sectionIndex + 1}`,
              columns: rowColumns,
              settings: section.settings?.desktop || {}
            };
          });
        }
        
        // For backward compatibility, if only one row exists, use the old columns format
        // Otherwise use the new rows format
        if (footerRows.length === 1) {
          payload = {
            columns: footerRows[0].columns,
            settings: footerRows[0].settings || data.deviceSettings || {}
          };
        } else {
          payload = {
            rows: footerRows,
            settings: data.deviceSettings || {}
          };
        }
      }
      
      console.log(`Sending ${layoutType} payload:`, payload);
      
      if (layoutType === 'header') {
        await updateHeader({
          websiteId: websiteIdNum,
          data: payload
        }).unwrap();
      } else {
        await updateFooter({
          websiteId: websiteIdNum,
          data: payload
        }).unwrap();
      }
      console.log(`✅ ${layoutType} saved successfully`);
    } catch (error) {
      console.error(`❌ Failed to save ${layoutType}:`, error);
      // Log the full error for debugging
      if (error?.data) {
        console.error('Error details:', error.data);
      }
    }
  }, [layoutType, updateHeader, updateFooter, websiteIdNum]);
  
  const handleExit = useCallback(() => {
    navigate('/cg-builder');
  }, [navigate]);

  // Switch layout type
  const handleLayoutTypeChange = useCallback((type: LayoutType) => {
    const newUrl = `/cg-builder/layout?type=${type}`;
    navigate(newUrl);
  }, [navigate]);
  
  if (isLoading) {
    return (
      <CGBuilderLayout title={`${layoutType.charAt(0).toUpperCase() + layoutType.slice(1)} Builder`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {layoutType} builder...</p>
          </div>
        </div>
      </CGBuilderLayout>
    );
  }
  
  if (websiteIdNum === 0) {
    return (
      <CGBuilderLayout title={`${layoutType.charAt(0).toUpperCase() + layoutType.slice(1)} Builder`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No website selected</p>
            <button
              onClick={() => navigate('/cg-builder')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to CG Builder
            </button>
          </div>
        </div>
      </CGBuilderLayout>
    );
  }
  
  return (
    <div className="h-screen bg-gray-50">
      {/* Layout Type Switcher */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/cg-builder')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to CG Builder"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <h1 className="text-sm font-medium text-gray-900">Layout Builder</h1>
          </div>

          {/* Layout Type Toggle */}
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => handleLayoutTypeChange('header')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  layoutType === 'header'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Header
              </button>
              <button
                onClick={() => handleLayoutTypeChange('footer')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  layoutType === 'footer'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Footer
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Layout Builder Content */}
      <div className="h-[calc(100vh-60px)]">
        {console.log('🚀 About to render UnifiedPageBuilder with:', {
          layoutType,
          sectionsCount: layoutSections.length,
          sections: layoutSections,
          componentTypesCount: layoutComponentTypes.length
        })}
        <UnifiedPageBuilder
          componentTypes={layoutComponentTypes}
          sections={layoutSections}
          websiteId={websiteIdNum}
          pageId={undefined} // Layout doesn't use pageId
          layoutMode={layoutType} // Pass the layout mode (header/footer)
          onDropComponent={handleDropComponent}
          onUpdateComponent={handleUpdateComponent}
          onDeleteComponent={handleDeleteComponent}
          onSelectComponent={handleSelectComponent}
          selectedComponent={selectedComponent}
          onSave={handleSave}
          onExit={handleExit}
          externalSaving={layoutType === 'header' ? isUpdatingHeader : isUpdatingFooter}
        />
      </div>
    </div>
  );
}