import { createApi } from "@reduxjs/toolkit/query/react";
import { PREFIX } from "@seller/seller_env";
import { ApiResponseType } from "@type/apiType";
import { SubscriptionPlansApiResponseType } from "@type/subscriptionPlanType";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { setPlans } from "../slices/subscriptionPlanSlice";

export interface SubscribePayloadType {
    package_id: number;
    amount: string;
}

export const subscriptionPlanApi = createApi({
    reducerPath: "subscriptionPlansApi",
    baseQuery: baseQuery,
    tagTypes: ["Subscription"],
    endpoints: (builder) => ({
        fetchPlans: builder.query<SubscriptionPlansApiResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `/subscription-plans`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["Subscription"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    dispatch(setPlans(response?.data?.data?.subscriptions));
                });
            },
        }),

        subscribePlan: builder.mutation<ApiResponseType, SubscribePayloadType>({
            query: (formData) =>
                createRequest({
                    url: `${PREFIX}/package-subscription`,
                    method: "post",
                    body: formData,
                }),
            invalidatesTags: ["Subscription"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { queryFulfilled }) {
                await queryFulfilled.then();
            },
        }),
    }),
});

export const { useFetchPlansQuery, useSubscribePlanMutation } =
    subscriptionPlanApi;
