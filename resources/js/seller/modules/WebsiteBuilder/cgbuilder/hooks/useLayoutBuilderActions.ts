import { useCallback } from 'react';
import type { PageComponent, PageSection } from '../../types';

interface UseLayoutBuilderActionsProps {
  sections: PageSection[];
  setSections: (sections: PageSection[]) => void;
  layoutType: 'header' | 'footer';
  websiteIdNum: number;
  updateHeader: any;
  updateFooter: any;
  transformSectionsFromAPI: (data: any) => PageSection[];
  dispatch: any;
  setSelectedComponent: any;
}

export function useLayoutBuilderActions({
  sections,
  setSections,
  layoutType,
  websiteIdNum,
  updateHeader,
  updateFooter,
  transformSectionsFromAPI,
  dispatch,
  setSelectedComponent,
}: UseLayoutBuilderActionsProps) {

  const handleDropComponent = useCallback((componentType: any, sectionId: string, columnId: string, position?: number) => {
    const newComponent: PageComponent = {
      id: `${componentType.name}-${Date.now()}`,
      type: componentType.name,
      content: componentType.default_props || {},
      settings: {
        styles: {},
        responsive: {
          desktop: { display: 'block' },
          tablet: { display: 'block' },
          mobile: { display: 'block' }
        }
      }
    };

    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          const updatedColumns = section.columns.map(column => {
            if (column.id === columnId) {
              const newComponents = [...column.components];
              if (position !== undefined) {
                newComponents.splice(position, 0, newComponent);
              } else {
                newComponents.push(newComponent);
              }
              return { ...column, components: newComponents };
            }
            return column;
          });
          return { ...section, columns: updatedColumns };
        }
        return section;
      })
    );
  }, [setSections]);

  const handleUpdateComponent = useCallback((componentId: string, updates: any) => {
    setSections(prevSections => 
      prevSections.map(section => ({
        ...section,
        columns: section.columns.map(column => ({
          ...column,
          components: column.components.map(component => 
            component.id === componentId 
              ? { ...component, ...updates }
              : component
          )
        }))
      }))
    );
  }, [setSections]);

  const handleDeleteComponent = useCallback((componentId: string) => {
    setSections(prevSections => 
      prevSections.map(section => ({
        ...section,
        columns: section.columns.map(column => ({
          ...column,
          components: column.components.filter(component => component.id !== componentId)
        }))
      }))
    );
  }, [setSections]);

  const handleSelectComponent = useCallback((component: PageComponent | null) => {
    dispatch(setSelectedComponent(component));
  }, [dispatch, setSelectedComponent]);

  const handleSave = useCallback(async (data: any) => {
    try {
      let payload: any;
      
      if (layoutType === 'header') {
        const headerSections = data.sections || sections;
        
        if (headerSections.length === 1) {
          payload = {
            elements: headerSections[0].columns,
            settings: headerSections[0].settings || data.deviceSettings || {}
          };
        } else {
          payload = {
            rows: headerSections,
            settings: data.deviceSettings || {}
          };
        }
        
        await updateHeader({
          websiteId: websiteIdNum,
          ...payload
        }).unwrap();
      } else {
        const footerRows = data.sections || sections;
        
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
        
        await updateFooter({
          websiteId: websiteIdNum,
          ...payload
        }).unwrap();
      }

      console.log(`✅ ${layoutType} saved successfully`);
    } catch (error) {
      console.error(`❌ Failed to save ${layoutType}:`, error);
    }
  }, [sections, layoutType, websiteIdNum, updateHeader, updateFooter]);

  return {
    handleDropComponent,
    handleUpdateComponent,
    handleDeleteComponent,
    handleSelectComponent,
    handleSave,
  };
}