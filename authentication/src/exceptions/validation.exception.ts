export class ValidationException {
    status: number;
    code: string;
    message: string

    constructor(
        status: number,
        code: string,
        message: string
    ){
        this.message = message;
        this.status = status;
        this.code = code;
    }
}