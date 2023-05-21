export class ApiError extends Error {
    readonly status: number;
    readonly errors: any[];

    getStatus(): number {
        return this.status;
    }

    getErrors(): any[] {
        return this.errors;
    }

    constructor(status: number, message: string, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError(message: string = 'User is unauthorized') {
        return new ApiError(401, message)
    }

    static BadRequest(message: string, errors = []) {
        return new ApiError(400, message, errors)
    }

    static Forbidden(message: string, errors = []) {
        return new ApiError(403, message, errors)
    }

    static NotFound(message: string, errors = []) {
        return new ApiError(404, message, errors)
    }
}
