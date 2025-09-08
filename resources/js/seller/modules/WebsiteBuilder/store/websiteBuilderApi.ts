import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReAuth from '../../../store/baseQueryWithReAuth';
import type {
  StoreWebsite,
  WebsitePage,
  PageSection,
  PageComponent,
  ComponentCategory,
  ComponentType,
  WebsiteTemplate,
} from '../types';

export const websiteBuilderApi = createApi({
  reducerPath: 'websiteBuilderApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    'Website',
    'Page',
    'Section', 
    'Component',
    'ComponentType',
    'Template',
    'Menu',
    'WebsiteSettings'
  ],
  endpoints: (builder) => ({
    // Websites
    getWebsites: builder.query<{ data: StoreWebsite[] }, void>({
      query: () => '/websites',
      providesTags: ['Website'],
    }),

    getWebsite: builder.query<{ data: StoreWebsite }, number>({
      query: (id) => `/websites/${id}`,
      providesTags: (result, error, id) => [{ type: 'Website', id }],
    }),

    createWebsite: builder.mutation<{ data: StoreWebsite }, Partial<StoreWebsite>>({
      query: (website) => ({
        url: '/websites',
        method: 'POST',
        body: website,
      }),
      invalidatesTags: ['Website'],
    }),

    updateWebsite: builder.mutation<{ data: StoreWebsite }, { id: number; data: Partial<StoreWebsite> }>({
      query: ({ id, data }) => ({
        url: `/websites/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Website', id }],
    }),

    deleteWebsite: builder.mutation<void, number>({
      query: (id) => ({
        url: `/websites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Website'],
    }),

    publishWebsite: builder.mutation<{ data: StoreWebsite }, number>({
      query: (id) => ({
        url: `/websites/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Website', id }],
    }),

    unpublishWebsite: builder.mutation<{ data: StoreWebsite }, number>({
      query: (id) => ({
        url: `/websites/${id}/unpublish`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Website', id }],
    }),

    duplicateWebsite: builder.mutation<{ data: StoreWebsite }, number>({
      query: (id) => ({
        url: `/websites/${id}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: ['Website'],
    }),

    createWebsiteFromTemplate: builder.mutation<{ data: StoreWebsite }, {
      template_id: number;
      title: string;
      subdomain: string;
    }>({
      query: (data) => ({
        url: '/websites/create-from-template',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Website'],
    }),

    // Pages
    getPages: builder.query<{ data: WebsitePage[] }, void>({
      query: () => `/pages`,
      providesTags: (result) => [
        { type: 'Page', id: 'LIST' },
        ...(result?.data || []).map(({ id }) => ({ type: 'Page' as const, id })),
      ],
    }),

    getPage: builder.query<{ data: WebsitePage }, number>({
      query: (pageId) => `/pages/${pageId}`,
      providesTags: (result, error, pageId) => [{ type: 'Page', id: pageId }],
    }),

    createPage: builder.mutation<{ data: WebsitePage }, {
      websiteId: number;
      data: Partial<WebsitePage>;
    }>({
      query: ({ websiteId, data }) => ({
        url: `/websites/${websiteId}/pages`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Page'],
    }),

    updatePage: builder.mutation<{ data: WebsitePage }, {
      websiteId: number;
      pageId: number;
      data: Partial<WebsitePage>;
    }>({
      query: ({ websiteId, pageId, data }) => ({
        url: `/websites/${websiteId}/pages/${pageId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { pageId }) => [{ type: 'Page', id: pageId }],
    }),

    deletePage: builder.mutation<void, { websiteId: number; pageId: number }>({
      query: ({ websiteId, pageId }) => ({
        url: `/websites/${websiteId}/pages/${pageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Page'],
    }),

    duplicatePage: builder.mutation<{ data: WebsitePage }, { websiteId: number; pageId: number }>({
      query: ({ websiteId, pageId }) => ({
        url: `/websites/${websiteId}/pages/${pageId}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: ['Page'],
    }),

    setHomepage: builder.mutation<{ data: WebsitePage }, { websiteId: number; pageId: number }>({
      query: ({ websiteId, pageId }) => ({
        url: `/websites/${websiteId}/pages/${pageId}/set-homepage`,
        method: 'POST',
      }),
      invalidatesTags: ['Page'],
    }),

    reorderPages: builder.mutation<void, {
      websiteId: number;
      pages: Array<{ id: number; sort_order: number }>;
    }>({
      query: ({ websiteId, pages }) => ({
        url: `/websites/${websiteId}/pages/reorder`,
        method: 'POST',
        body: { pages },
      }),
      invalidatesTags: ['Page'],
    }),

    // Sections
    getSections: builder.query<{ data: PageSection[] }, number>({
      query: (pageId) => `/pages/${pageId}/sections`,
      providesTags: (result, error, pageId) => [
        { type: 'Section', id: 'LIST' },
        ...(result?.data || []).map(({ id }) => ({ type: 'Section' as const, id })),
      ],
    }),

    createSection: builder.mutation<{ data: PageSection }, {
      pageId: number;
      data: Partial<PageSection>;
    }>({
      query: ({ pageId, data }) => ({
        url: `/pages/${pageId}/sections`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Section', 'Page'],
    }),

    updateSection: builder.mutation<{ data: PageSection }, {
      pageId: number;
      sectionId: number;
      data: Partial<PageSection>;
    }>({
      query: ({ pageId, sectionId, data }) => ({
        url: `/pages/${pageId}/sections/${sectionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { sectionId }) => [{ type: 'Section', id: sectionId }],
    }),

    deleteSection: builder.mutation<void, { pageId: number; sectionId: number }>({
      query: ({ pageId, sectionId }) => ({
        url: `/pages/${pageId}/sections/${sectionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Section', 'Page'],
    }),

    duplicateSection: builder.mutation<{ data: PageSection }, { pageId: number; sectionId: number }>({
      query: ({ pageId, sectionId }) => ({
        url: `/pages/${pageId}/sections/${sectionId}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: ['Section', 'Page'],
    }),

    // Components
    getComponentCategories: builder.query<{ data: ComponentCategory[] }, void>({
      query: () => '/components/categories',
      providesTags: ['ComponentType'],
    }),

    getComponentTypes: builder.query<{ data: ComponentType[] }, void>({
      query: () => '/components/types',
      providesTags: ['ComponentType'],
    }),

    getComponentType: builder.query<{ data: ComponentType }, number>({
      query: (id) => `/components/types/${id}`,
      providesTags: (result, error, id) => [{ type: 'ComponentType', id }],
    }),

    addComponent: builder.mutation<{ data: PageComponent }, Partial<PageComponent>>({
      query: (component) => ({
        url: '/components',
        method: 'POST',
        body: component,
      }),
      invalidatesTags: ['Component', 'Section', 'Page'],
    }),

    updateComponent: builder.mutation<{ data: PageComponent }, {
      id: number;
      data: Partial<PageComponent>;
    }>({
      query: ({ id, data }) => ({
        url: `/components/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Component', id }],
    }),

    deleteComponent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/components/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Component', 'Section', 'Page'],
    }),

    duplicateComponent: builder.mutation<{ data: PageComponent }, number>({
      query: (id) => ({
        url: `/components/${id}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: ['Component', 'Section', 'Page'],
    }),

    reorderComponents: builder.mutation<void, {
      section_id: number;
      components: Array<{ id: number; sort_order: number }>;
    }>({
      query: (data) => ({
        url: '/components/reorder',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Component', 'Section'],
    }),

    moveComponent: builder.mutation<void, {
      component_id: number;
      target_section_id: number;
      target_position: number;
    }>({
      query: (data) => ({
        url: '/components/move',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Component', 'Section'],
    }),

    // Templates
    getTemplates: builder.query<{ data: WebsiteTemplate[] }, {
      category?: string;
      type?: 'free' | 'premium';
    }>({
      query: (params) => ({
        url: '/templates',
        params,
      }),
      providesTags: ['Template'],
    }),

    getTemplate: builder.query<{ data: WebsiteTemplate }, number>({
      query: (id) => `/templates/${id}`,
      providesTags: (result, error, id) => [{ type: 'Template', id }],
    }),

    previewTemplate: builder.query<{ data: any }, number>({
      query: (id) => `/templates/${id}/preview`,
    }),

    // Website Settings
    getWebsiteSettings: builder.query<{ data: any }, void>({
      query: () => '/website-settings',
      providesTags: ['WebsiteSettings'],
    }),

    updateBasicSettings: builder.mutation<{ data: any }, FormData>({
      query: (data) => ({
        url: '/website-settings/basic',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WebsiteSettings'],
    }),

    updateSeoSettings: builder.mutation<{ data: any }, FormData>({
      query: (data) => ({
        url: '/website-settings/seo',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WebsiteSettings'],
    }),

    updateAnalyticsSettings: builder.mutation<{ data: any }, any>({
      query: (data) => ({
        url: '/website-settings/analytics',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WebsiteSettings'],
    }),

    updateGlobalStyles: builder.mutation<{ data: any }, any>({
      query: (data) => ({
        url: '/website-settings/styles',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WebsiteSettings'],
    }),

    updateSocialMedia: builder.mutation<{ data: any }, any>({
      query: (data) => ({
        url: '/website-settings/social-media',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WebsiteSettings'],
    }),

    toggleMaintenanceMode: builder.mutation<{ data: any }, any>({
      query: (data) => ({
        url: '/website-settings/maintenance',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WebsiteSettings'],
    }),

    // Website Menus
    getWebsiteMenus: builder.query<{ data: any[] }, number>({
      query: (websiteId) => `/websites/${websiteId}/menus`,
      providesTags: ['Menu'],
    }),

    getWebsiteMenu: builder.query<{ data: any }, { websiteId: number; menuId: number }>({
      query: ({ websiteId, menuId }) => `/websites/${websiteId}/menus/${menuId}`,
      providesTags: (result, error, { menuId }) => [{ type: 'Menu', id: menuId }],
    }),

    createWebsiteMenu: builder.mutation<{ data: any }, { websiteId: number; data: any }>({
      query: ({ websiteId, data }) => ({
        url: `/websites/${websiteId}/menus`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Menu'],
    }),

    updateWebsiteMenu: builder.mutation<{ data: any }, { websiteId: number; menuId: number; data: any }>({
      query: ({ websiteId, menuId, data }) => ({
        url: `/websites/${websiteId}/menus/${menuId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { menuId }) => [{ type: 'Menu', id: menuId }],
    }),

    deleteWebsiteMenu: builder.mutation<void, { websiteId: number; menuId: number }>({
      query: ({ websiteId, menuId }) => ({
        url: `/websites/${websiteId}/menus/${menuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Menu'],
    }),

    // Header and Footer
    getHeader: builder.query<{ data: any }, number>({
      query: (websiteId) => `/websites/${websiteId}/header`,
      providesTags: (result, error, websiteId) => [{ type: 'Website', id: `${websiteId}-header` }],
    }),

    updateHeader: builder.mutation<{ data: any }, { websiteId: number; data: any }>({
      query: ({ websiteId, data }) => ({
        url: `/websites/${websiteId}/header`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { websiteId }) => [{ type: 'Website', id: `${websiteId}-header` }],
    }),

    getFooter: builder.query<{ data: any }, number>({
      query: (websiteId) => `/websites/${websiteId}/footer`,
      providesTags: (result, error, websiteId) => [{ type: 'Website', id: `${websiteId}-footer` }],
    }),

    updateFooter: builder.mutation<{ data: any }, { websiteId: number; data: any }>({
      query: ({ websiteId, data }) => ({
        url: `/websites/${websiteId}/footer`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { websiteId }) => [{ type: 'Website', id: `${websiteId}-footer` }],
    }),

    // Elementor page data
    saveElementorPageData: builder.mutation<
      { status: number; message: string; data: any }, 
      { pageId: number; sections: any[]; deviceSettings?: any }
    >({
      query: ({ pageId, sections, deviceSettings }) => ({
        url: `/website-builder/pages/${pageId}/elementor-data`,
        method: 'PUT',
        body: { sections, deviceSettings },
      }),
      invalidatesTags: (result, error, { pageId }) => [{ type: 'Page', id: pageId }],
    }),
  }),
});

export const {
  // Websites
  useGetWebsitesQuery,
  useGetWebsiteQuery,
  useCreateWebsiteMutation,
  useUpdateWebsiteMutation,
  useDeleteWebsiteMutation,
  usePublishWebsiteMutation,
  useUnpublishWebsiteMutation,
  useDuplicateWebsiteMutation,
  useCreateWebsiteFromTemplateMutation,

  // Pages
  useGetPagesQuery,
  useGetPageQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useDuplicatePageMutation,
  useSetHomepageMutation,
  useReorderPagesMutation,

  // Sections
  useGetSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useDuplicateSectionMutation,

  // Components
  useGetComponentCategoriesQuery,
  useGetComponentTypesQuery,
  useGetComponentTypeQuery,
  useAddComponentMutation,
  useUpdateComponentMutation,
  useDeleteComponentMutation,
  useDuplicateComponentMutation,
  useReorderComponentsMutation,
  useMoveComponentMutation,

  // Templates
  useGetTemplatesQuery,
  useGetTemplateQuery,
  usePreviewTemplateQuery,

  // Website Settings
  useGetWebsiteSettingsQuery,
  useUpdateBasicSettingsMutation,
  useUpdateSeoSettingsMutation,
  useUpdateAnalyticsSettingsMutation,
  useUpdateGlobalStylesMutation,
  useUpdateSocialMediaMutation,
  useToggleMaintenanceModeMutation,

  // Website Menus
  useGetWebsiteMenusQuery,
  useGetWebsiteMenuQuery,
  useCreateWebsiteMenuMutation,
  useUpdateWebsiteMenuMutation,
  useDeleteWebsiteMenuMutation,

  // Header and Footer
  useGetHeaderQuery,
  useUpdateHeaderMutation,
  useGetFooterQuery,
  useUpdateFooterMutation,

  // Elementor page data
  useSaveElementorPageDataMutation,
} = websiteBuilderApi;