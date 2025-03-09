import { GLOBAL_APP_API_URL } from "@helper/global_env";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
    baseUrl: GLOBAL_APP_API_URL,

    prepareHeaders: (
        headers: Headers
        // api: {
        //     getState: () => RootState | any;
        //     arg: string | FetchArgs;
        //     extra: unknown;
        //     endpoint: string;
        //     type: "query" | "mutation";
        // }
    ) => {
        headers.set("accept", "application/json");

        // const state: RootState = api.getState();
        let accessToken = "";

        if (!accessToken) {
            const localStrData = JSON.parse(
                localStorage.getItem("persist:site") || "{}"
            );
            accessToken = localStrData.auth.accessToken;
        }

        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);
        }

        return headers;
    },
});

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // api.dispatch(clearAuth());
        // if (window) {
        // 	window.location.href = `/login`;
        // }
    }

    return result;
};

export const createRequest = ({
    url,
    method = "GET",
    body,
    apiMethod,
}: {
    url: string;
    method?: string;
    body?: any;
    apiMethod?: string;
}) => {
    if (apiMethod) {
        return {
            url,
            method,
            body: { ...body, _method: apiMethod },
        };
    }

    return {
        url,
        method,
        body,
    };
};

export default baseQueryWithReAuth;
