import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReAuth, { createRequest } from "../../../store/baseQueryWithReAuth";
import { PREFIX } from "@seller/seller_env";
import { setPlans } from "./subscriptionSlice";
import type { 
  SubscriptionPlansResponse, 
  SubscriptionResponse, 
  SubscribePayload, 
  CancelSubscriptionPayload,
  UpdateSubscriptionPayload
} from "../types";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Subscription", "Plans"],
  endpoints: (builder) => ({
    fetchPlans: builder.query<SubscriptionPlansResponse, void>({
      query: () =>
        createRequest({
          url: `/subscription-plans`,
          method: "get",
        }),
      providesTags: ["Plans"],
      transformErrorResponse: (error: any) => error.data,
      async onQueryStarted(_queryArgument, { dispatch, queryFulfilled }) {
        await queryFulfilled.then((response) => {
          dispatch(
            setPlans({
              plans: response.data.data.plans,
              meta: response.data.meta ?? undefined,
            })
          );
        });
      },
    }),

    // subscribe to plan (using original working endpoint)
    subscribePlan: builder.mutation<SubscriptionResponse, SubscribePayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/package-subscription`,
          method: "post",
          body: formData,
        }),
      invalidatesTags: ["Subscription"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // cancel subscription
    cancelSubscription: builder.mutation<SubscriptionResponse, CancelSubscriptionPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/subscriptions/${formData.subscription_id}/cancel`,
          method: "post",
          body: { reason: formData.reason },
        }),
      invalidatesTags: ["Subscription"],
      transformErrorResponse: (error: any) => error.data,
    }),

    // update subscription
    updateSubscription: builder.mutation<SubscriptionResponse, UpdateSubscriptionPayload>({
      query: (formData) =>
        createRequest({
          url: `${PREFIX}/subscriptions/${formData.subscription_id}`,
          method: "post",
          apiMethod: "PUT",
          body: formData,
        }),
      invalidatesTags: ["Subscription"],
      transformErrorResponse: (error: any) => error.data,
    }),
  }),
});

export const {
  useFetchPlansQuery,
  useSubscribePlanMutation,
  useCancelSubscriptionMutation,
  useUpdateSubscriptionMutation,
} = subscriptionApi;