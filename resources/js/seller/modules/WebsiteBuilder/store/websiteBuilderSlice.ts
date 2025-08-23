import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WebsiteBuilderState, StoreWebsite, WebsitePage, PageComponent, DragItem } from '../types';

const initialState: WebsiteBuilderState = {
  // Websites
  websites: [],
  currentWebsite: null,
  websitesLoading: false,
  
  // Pages
  pages: [],
  currentPage: null,
  pagesLoading: false,
  
  // Components
  componentCategories: [],
  componentTypes: [],
  componentsLoading: false,
  
  // Templates
  templates: [],
  templatesLoading: false,
  
  // UI State
  isEditing: false,
  selectedComponent: null,
  draggedItem: null,
  previewMode: false,
  
  // Errors
  error: null,
};

const websiteBuilderSlice = createSlice({
  name: 'websiteBuilder',
  initialState,
  reducers: {
    // Website actions
    setCurrentWebsite: (state, action: PayloadAction<StoreWebsite | null>) => {
      state.currentWebsite = action.payload;
    },

    // Page actions
    setCurrentPage: (state, action: PayloadAction<WebsitePage | null>) => {
      state.currentPage = action.payload;
    },

    // Component actions
    setSelectedComponent: (state, action: PayloadAction<PageComponent | null>) => {
      state.selectedComponent = action.payload;
    },

    // Drag and drop
    setDraggedItem: (state, action: PayloadAction<DragItem | null>) => {
      state.draggedItem = action.payload;
    },

    // UI state
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },

    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload;
    },

    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear all state
    resetState: () => initialState,

    // Component updates in real-time
    updateComponentProps: (state, action: PayloadAction<{
      componentId: number;
      props: Record<string, any>;
    }>) => {
      if (state.currentPage) {
        const { componentId, props } = action.payload;
        
        // Find and update the component in the current page
        for (const section of state.currentPage.sections || []) {
          const component = section.components?.find(c => c.id === componentId);
          if (component) {
            component.props = { ...component.props, ...props };
            break;
          }
        }
      }
    },

    updateComponentStyles: (state, action: PayloadAction<{
      componentId: number;
      styles: Record<string, any>;
    }>) => {
      if (state.currentPage) {
        const { componentId, styles } = action.payload;
        
        // Find and update the component in the current page
        for (const section of state.currentPage.sections || []) {
          const component = section.components?.find(c => c.id === componentId);
          if (component) {
            component.styles = { ...component.styles, ...styles };
            break;
          }
        }
      }
    },

    // Section management
    addSection: (state, action: PayloadAction<{
      section: any;
      position?: number;
    }>) => {
      if (state.currentPage) {
        const { section, position } = action.payload;
        
        if (!state.currentPage.sections) {
          state.currentPage.sections = [];
        }

        if (position !== undefined) {
          state.currentPage.sections.splice(position, 0, section);
        } else {
          state.currentPage.sections.push(section);
        }

        // Update sort orders
        state.currentPage.sections.forEach((s, index) => {
          s.sort_order = index;
        });
      }
    },

    removeSection: (state, action: PayloadAction<number>) => {
      if (state.currentPage) {
        const sectionId = action.payload;
        state.currentPage.sections = state.currentPage.sections?.filter(
          s => s.id !== sectionId
        ) || [];

        // Update sort orders
        state.currentPage.sections.forEach((s, index) => {
          s.sort_order = index;
        });
      }
    },

    // Component management within sections
    addComponentToSection: (state, action: PayloadAction<{
      sectionId: number;
      component: PageComponent;
      position?: number;
    }>) => {
      if (state.currentPage) {
        const { sectionId, component, position } = action.payload;
        
        const section = state.currentPage.sections?.find(s => s.id === sectionId);
        if (section) {
          if (!section.components) {
            section.components = [];
          }

          if (position !== undefined) {
            section.components.splice(position, 0, component);
          } else {
            section.components.push(component);
          }

          // Update sort orders
          section.components.forEach((c, index) => {
            c.sort_order = index;
          });
        }
      }
    },

    removeComponentFromSection: (state, action: PayloadAction<{
      sectionId: number;
      componentId: number;
    }>) => {
      if (state.currentPage) {
        const { sectionId, componentId } = action.payload;
        
        const section = state.currentPage.sections?.find(s => s.id === sectionId);
        if (section) {
          section.components = section.components?.filter(
            c => c.id !== componentId
          ) || [];

          // Update sort orders
          section.components.forEach((c, index) => {
            c.sort_order = index;
          });
        }
      }
    },

    // Reorder components within a section
    reorderComponentsInSection: (state, action: PayloadAction<{
      sectionId: number;
      fromIndex: number;
      toIndex: number;
    }>) => {
      if (state.currentPage) {
        const { sectionId, fromIndex, toIndex } = action.payload;
        
        const section = state.currentPage.sections?.find(s => s.id === sectionId);
        if (section && section.components) {
          const [movedComponent] = section.components.splice(fromIndex, 1);
          section.components.splice(toIndex, 0, movedComponent);

          // Update sort orders
          section.components.forEach((c, index) => {
            c.sort_order = index;
          });
        }
      }
    },

    // Move component between sections
    moveComponentBetweenSections: (state, action: PayloadAction<{
      fromSectionId: number;
      toSectionId: number;
      componentId: number;
      toIndex: number;
    }>) => {
      if (state.currentPage) {
        const { fromSectionId, toSectionId, componentId, toIndex } = action.payload;
        
        const fromSection = state.currentPage.sections?.find(s => s.id === fromSectionId);
        const toSection = state.currentPage.sections?.find(s => s.id === toSectionId);
        
        if (fromSection && toSection && fromSection.components) {
          const componentIndex = fromSection.components.findIndex(c => c.id === componentId);
          if (componentIndex !== -1) {
            const [movedComponent] = fromSection.components.splice(componentIndex, 1);
            
            // Update component's section_id
            movedComponent.section_id = toSectionId;
            
            if (!toSection.components) {
              toSection.components = [];
            }
            
            toSection.components.splice(toIndex, 0, movedComponent);

            // Update sort orders for both sections
            fromSection.components.forEach((c, index) => {
              c.sort_order = index;
            });
            
            toSection.components.forEach((c, index) => {
              c.sort_order = index;
            });
          }
        }
      }
    },
  },
});

export const {
  setCurrentWebsite,
  setCurrentPage,
  setSelectedComponent,
  setDraggedItem,
  setIsEditing,
  setPreviewMode,
  setError,
  resetState,
  updateComponentProps,
  updateComponentStyles,
  addSection,
  removeSection,
  addComponentToSection,
  removeComponentFromSection,
  reorderComponentsInSection,
  moveComponentBetweenSections,
} = websiteBuilderSlice.actions;

export default websiteBuilderSlice.reducer;