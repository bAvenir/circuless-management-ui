import Ajv, { type ErrorObject } from "ajv";
import schema from "../schemas/TDValidation.json";

interface ValidationFeedBack {
    valid: boolean;
    statusCode?: HttpStatusCode;
    errors: ErrorObject[] | null;
}

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

export async function TDValidator(Body: any): Promise<ValidationFeedBack> {
    const valid = await validate(Body);

    if (!valid) {
        return {
            statusCode: HttpStatusCode.BAD_REQUEST,
            valid: valid,
            errors: validate.errors ?? null,
        };
    }
    return { valid: true, errors: null };
}
