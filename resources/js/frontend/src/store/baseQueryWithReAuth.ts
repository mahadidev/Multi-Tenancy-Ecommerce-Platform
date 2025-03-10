import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/v1",

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
