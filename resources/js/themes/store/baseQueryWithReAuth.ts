import { API_URL } from "@/themes/env";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (headers: Headers) => {
        headers.set("accept", "application/json");

        // const state: RootState = api.getState();
        // let accessToken = state?.auth?.accessToken;

        // if (!accessToken) {
        //     const localStrData = JSON.parse(
        //         localStorage.getItem("persist:site") || "{}"
        //     );
        //     accessToken = localStrData.auth.accessToken;
        // }

        // if (accessToken) {
        //     headers.set("authorization", `Bearer ${accessToken}`);
        // }

        return headers;
    },
});

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);

    // if (result.error && result.error.status === 401) {
    //     api.dispatch(removeAuth());
    //     api.dispatch(removeStore());
    //     window.location.href = `${PATH_PREFIX}${RoutePath.login}`;
    // }

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
