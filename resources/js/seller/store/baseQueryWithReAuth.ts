import { PATH_PREFIX, RoutePath } from "@/seller/env";
import { FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { API_URL } from "./env";
import { RootState } from "./index";
import { removeAuth } from "./slices/authSlice";

export const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (
        headers: Headers,
        api: {
            getState: () => RootState | any;
            arg: string | FetchArgs;
            extra: unknown;
            endpoint: string;
            type: "query" | "mutation";
        }
    ) => {
        headers.set("accept", "application/json");

        const state: RootState = api.getState();
        const accessToken = state.auth.accessToken;

        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);
        }

        return headers;
    },
});

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        api.dispatch(removeAuth());
        window.location.href = `${PATH_PREFIX}${RoutePath.login}`;
    }

    return result;
};

export const createRequest = ({
    url,
    method = "GET",
    body,
}: {
    url: string;
    method?: string;
    body?: any;
}) => ({
    url,
    method,
    body,
});

export default baseQueryWithReAuth;
