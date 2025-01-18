export interface ResponseType {
    status: 200;
    message: string;
    data: any;
}

export interface ErrorResponseType {
    status: 200 | 404 | 422;
    errors?: { [key: string]: string[] }[];
    message: string;
}
