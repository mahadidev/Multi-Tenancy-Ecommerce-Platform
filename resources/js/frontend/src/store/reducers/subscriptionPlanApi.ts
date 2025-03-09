import { createApi } from "@reduxjs/toolkit/query/react";
import { SubscriptionPlansApiResponseType } from "@type/subscriptionPlanType";
import { baseQuery, createRequest } from "../baseQueryWithReAuth";

export const subscriptionPlanApi = createApi({
    reducerPath: "subscriptionPlanApi",
    baseQuery: baseQuery,
    tagTypes: ["SubscriptionPlans"],
    endpoints: (builder) => ({
        fetchPlans: builder.query<SubscriptionPlansApiResponseType, void>({
            query: (formData) =>
                createRequest({
                    url: `http://127.0.0.1:8000/api/v1/subscription-plans`,
                    method: "get",
                    body: formData,
                }),
            providesTags: ["SubscriptionPlans"],
            transformErrorResponse: (error: any) => error.data,
            async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
                await queryFulfilled.then((response) => {
                    console.log({ response });
                });
            },
        }),
    }),
});

export const { useFetchPlansQuery } = subscriptionPlanApi;
