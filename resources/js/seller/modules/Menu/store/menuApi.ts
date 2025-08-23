import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { setMenus } from "./menuSlice";
import type { 
  MenusResponse, 
  MenuResponse, 
  CreateMenuPayload, 
  UpdateMenuPayload, 
  DeleteMenuPayload 
} from "../types";

export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Menus"],
  endpoints: (builder) => ({
    fetchMenus: builder.query<MenusResponse, void>({
      query: () =>
        createRequest({
          url: `${PREFIX}/menus`,
          method: "get",
        }),
      providesTags: ["Menus"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setMenus({
              menus: response.data.data.menus,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    createMenu: builder.mutation<MenuResponse, CreateMenuPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/menus`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Menus"],
      transformErrorResponse: (error: any) => error.data,
    }),

    updateMenu: builder.mutation<MenuResponse, UpdateMenuPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/menus/${formData.id}`,
          method: "post",
          apiMethod: "PUT",
          body: formData,
        }),
      invalidatesTags: ["Menus"],
      transformErrorResponse: (error: any) => error.data,
    }),

    deleteMenu: builder.mutation<MenuResponse, DeleteMenuPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/menus/${formData.id}`,
          method: "delete",
          body: formData,
        }),
      invalidatesTags: ["Menus"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchMenusQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} = menuApi;