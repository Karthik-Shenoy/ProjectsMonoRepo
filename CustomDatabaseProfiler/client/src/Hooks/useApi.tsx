import * as React from "react";

export type ApiBody<P> = RequestInit & {
    body: P;
};

export type ApiResponse<T> = {
    state: "loading" | "error" | "success";
    data?: T;
    reason?: string;
};

export function apiCall<P, T>(url: string, init?: ApiBody<P>) {
    const [apiResponse, setApiResponse] = React.useState<ApiResponse<T>>({ state: "loading" });

    React.useEffect(() => {
        fetch(url, init)
            .then((response) => response.json())
            .then((data) => {
                setApiResponse({ state: "success", data: data as T });
            })
            .catch((reason) => setApiResponse({ state: "error", reason }));
    }, [url, init]);

    return apiResponse;
}
