import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { MenuIdType, MenusResponseType, MenuType } from "@type/menuType";
import baseQueryWithReAuth, { createRequest } from "../baseQueryWithReAuth";
import { setMenus } from "../slices/menuSlice";

export interface MenusFetchResponse extends ApiResponseType {
    data: MenusResponseType;
}

export const menuApi = createApi({
    reducerPath: "menuApi",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Menus"],
    endpoints: (builder) => ({
        // fetch menu list
        fetchMenus: builder.query<MenusFetchResponse, void>({
            query: () =>
                createRequest({
                    url: `${PREFIX}/store-menus`,
                    method: "get",
                }),
            providesTags: ["Menus"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setMenus(response?.data?.data?.menus));
                });
            },
        }),

        // add menu
        addMenu: builder.mutation<ApiResponseType, MenuType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-menus`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Menus"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // remove menu
        removeMenu: builder.mutation<ApiResponseType, MenuIdType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-menus/${formData.id}`,
                    method: "post",
                    body: formData,
                    apiMethod: "DELETE",
                }),
            invalidatesTags: ["Menus"],
            transformErrorResponse: (error: any) => error.data,
        }),

        // update menu
        updateMenu: builder.mutation<ApiResponseType, MenuType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/store-menus/${formData.id}`,
                    method: "post",
                    body: formData,
                    apiMethod: "PUT",
                }),
            invalidatesTags: ["Menus"],
            transformErrorResponse: (error: any) => error.data,
        }),
    }),
});

export const {
    useFetchMenusQuery,
    useAddMenuMutation,
    useRemoveMenuMutation,
    useUpdateMenuMutation,
} = menuApi;
