import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useStore from '../../../../_hooks/useStore';
import {
  useGetWebsiteQuery,
  useGetHeaderQuery,
  useGetFooterQuery,
  useUpdateHeaderMutation,
  useUpdateFooterMutation,
  useGetComponentTypesQuery,
} from '../../store/websiteBuilderApi';
import {
  setCurrentWebsite,
  setSelectedComponent,
} from '../../store/websiteBuilderSlice';
import type { RootState } from '../../../../store/store';
import type { PageComponent, PageSection } from '../../types';

type LayoutType = 'header' | 'footer';

export function useLayoutBuilder(initialType?: LayoutType) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { store } = useStore();
  const [searchParams] = useSearchParams();
  
  const typeFromUrl = searchParams.get('type') as LayoutType | null;
  const [layoutType, setLayoutType] = useState<LayoutType>(
    initialType || typeFromUrl || 'header'
  );
  
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState<PageSection[]>([]);
  
  const websiteIdNum = store?.website?.id || 0;
  const selectedComponent = useSelector((state: RootState) => state.websiteBuilder.selectedComponent);
  
  // API hooks
  const { data: website, isLoading: isWebsiteLoading } = useGetWebsiteQuery(
    websiteIdNum,
    { skip: !websiteIdNum }
  );
  
  const { data: headerData, isLoading: isHeaderLoading } = useGetHeaderQuery(
    websiteIdNum,
    { skip: !websiteIdNum || layoutType !== 'header' }
  );
  
  const { data: footerData, isLoading: isFooterLoading } = useGetFooterQuery(
    websiteIdNum,
    { skip: !websiteIdNum || layoutType !== 'footer' }
  );
  
  const { data: componentTypesResponse } = useGetComponentTypesQuery(undefined);
  const [updateHeader, { isLoading: isUpdatingHeader }] = useUpdateHeaderMutation();
  const [updateFooter, { isLoading: isUpdatingFooter }] = useUpdateFooterMutation();
  
  // Transform sections from API data
  const transformSectionsFromAPI = useCallback((data: any): PageSection[] => {
    if (!data?.elements) return [];
    
    if (data.rows && Array.isArray(data.rows)) {
      return data.rows.map((row: any, index: number) => ({
        id: row.id || `section-${index}`,
        columns: row.columns || [],
        settings: row.settings || {},
      }));
    }
    
    if (Array.isArray(data.elements) && data.elements.length > 0) {
      return [{
        id: 'main-section',
        columns: data.elements,
        settings: data.settings || {},
      }];
    }
    
    return [];
  }, []);
  
  // Load sections when data changes
  useEffect(() => {
    const data = layoutType === 'header' ? headerData : footerData;
    const transformedSections = transformSectionsFromAPI(data);
    setSections(transformedSections);
    setIsLoading(false);
  }, [headerData, footerData, layoutType, transformSectionsFromAPI]);
  
  // Filter component types for layout
  const layoutComponentTypes = (componentTypesResponse?.data || []).filter((component: any) => {
    if (layoutType === 'header') {
      return ['logo', 'navigation-menu', 'search-bar', 'cart-icon', 'user-account', 'contact-info', 'social-icons'].includes(component.name);
    } else {
      return ['quick-links', 'social-icons', 'contact-info', 'newsletter-signup', 'copyright', 'payment-methods'].includes(component.name);
    }
  });
  
  const handleLayoutTypeChange = useCallback((newType: LayoutType) => {
    setLayoutType(newType);
    navigate(`/cg-builder/layout?type=${newType}`, { replace: true });
  }, [navigate]);
  
  const handleBack = useCallback(() => {
    navigate('/cg-builder');
  }, [navigate]);
  
  const handleExit = useCallback(() => {
    navigate('/cg-builder');
  }, [navigate]);
  
  return {
    layoutType,
    sections,
    setSections,
    isLoading,
    websiteIdNum,
    selectedComponent,
    layoutComponentTypes,
    isUpdatingHeader,
    isUpdatingFooter,
    updateHeader,
    updateFooter,
    handleLayoutTypeChange,
    handleBack,
    handleExit,
    dispatch,
    setSelectedComponent,
    transformSectionsFromAPI,
  };
}