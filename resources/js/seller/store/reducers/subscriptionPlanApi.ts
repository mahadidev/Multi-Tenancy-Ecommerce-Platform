import { createApi } from "@reduxjs/toolkit/query/react";
import { SubscriptionPlansApiResponseType } from "@type/subscriptionPlanType";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";
import { setPlans } from "../slices/subscriptionPlanSlice";

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
                    console.log({ responseFromRedux: response });
                    dispatch(setPlans(response?.data?.data?.subscriptions));
                });
            },
        }),
    }),
});

export const { useFetchPlansQuery } = subscriptionPlanApi;
