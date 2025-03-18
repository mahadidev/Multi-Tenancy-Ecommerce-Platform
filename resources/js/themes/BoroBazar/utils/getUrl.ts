export const getUrl = (storeSlug: string, url: string): string => {
    return `http://127.0.0.1:8000/sites/${storeSlug}/${url}`;
};
