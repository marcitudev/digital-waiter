export interface ResponseError {
    resource: string;
    method: string;
    status: number;
    code: string;
    message: string;
}