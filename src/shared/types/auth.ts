import Joi from "joi";

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
}

export interface UserRepresentation {
    id?: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export const KeycloakAuthCodeQuerySchema = Joi.object({
    iss: Joi.string().required(),
    code: Joi.string().required(),
    state: Joi.string().required(),
    session_state: Joi.string().required(),
}).required();

export const AuthQuerySchema = Joi.object({
    redirectUri: Joi.string().optional(),
}).optional();
