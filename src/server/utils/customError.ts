enum ErrorType {
    ValidationError = "ValidationError",
    ApplicationError = "ApplicationError",
    DatabaseError = "DatabaseError",
    KeycloakError = "KeycloakError",
    PKIError = "PKIError",
}

export class CustomError extends Error {
    public type: ErrorType;
    public statusCode: number;
    public details: any;

    constructor(
        type: ErrorType,
        message: string,
        statusCode: number,
        data?: any
    ) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.details = data;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export class ValidationError extends CustomError {
    constructor(message: string, statusCode: number, data?: any) {
        super(ErrorType.ValidationError, message, statusCode, data);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class ApplicationError extends CustomError {
    constructor(message: string, statusCode: number, data?: any) {
        super(ErrorType.ApplicationError, message, statusCode, data);
        Object.setPrototypeOf(this, ApplicationError.prototype);
    }
}

export class DatabaseError extends CustomError {
    constructor(message: string, statusCode: number, data?: any) {
        super(ErrorType.DatabaseError, message, statusCode, data);
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export class KeycloakError extends CustomError {
    constructor(message: string, statusCode: number, data?: any) {
        super(ErrorType.KeycloakError, message, statusCode, data);
        Object.setPrototypeOf(this, KeycloakError.prototype);
    }
}

export class PKIError extends CustomError {
    constructor(message: string, statusCode: number, data?: any) {
        super(ErrorType.PKIError, message, statusCode, data);
        Object.setPrototypeOf(this, PKIError.prototype);
    }
}
