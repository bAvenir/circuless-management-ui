import Joi from "joi";
import { H3Event, type EventHandlerRequest } from "h3";
import type { QueryObject } from "ufo";
import { Prisma, Realm } from "@prisma/client";
import { userManager } from "./userManager";

type ApiData = {
    params?: Record<string, string>;
    query?: QueryObject;
    body?: any;
    user?: Prisma.UserGetPayload<typeof db.user.args.all>;
};

type Options = {
    schemas?: { params?: Joi.Schema; query?: Joi.Schema; body?: Joi.Schema };
    protected?: boolean | Realm;
};

export async function apiWrapper<T>(
    event: H3Event<EventHandlerRequest>,
    request: (data: ApiData) => Promise<T>,
    options?: Options
): Promise<T> {
    try {
        const params = getRouterParams(event);
        const query = getQuery(event);
        const body =
            event.method === "GET" || event.method === "HEAD"
                ? undefined
                : await readBody(event);

        if (options?.protected === undefined || options.protected === true) {
            await validateAuthorization(event, (params.realm as Realm | undefined) || 'master')
        } else if (options.protected) {
            await validateAuthorization(event, options.protected)
        }

        validateRequest(params, query, body, options?.schemas);

        const requestData: ApiData = {
            params,
            query,
            body,
            user: event.context.user,
        };
        return await request(requestData);
    } catch (error) {
        throw errorHandler(error);
    }
}

function validateRequest(
    params?: Record<string, string>,
    query?: QueryObject,
    body?: any,
    schemas?: { params?: Joi.Schema; query?: Joi.Schema; body?: Joi.Schema }
) {
    if (params && Object.keys(params).length > 0 && !schemas?.params) {
        throw new ApplicationError(
            "Params are not allowed without validation schema",
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }

    if (query && Object.keys(query).length > 0 && !schemas?.query) {
        throw new ApplicationError(
            "Query is not allowed without validation schema",
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }

    if (body && Object.keys(body).length > 0 && !schemas?.body) {
        throw new ApplicationError(
            "Body is not allowed without validation schema",
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }

    validateSchema(schemas?.params, params, "params");
    validateSchema(schemas?.query, query, "query");
    validateSchema(schemas?.body, body, "body");
}

function validateSchema(schema?: Joi.Schema, data?: any, type?: string) {
    if (schema) {
        const res = schema.validate(data);
        if (res.error) {
            throw new ValidationError(
                `Validation error in ${type}`,
                HttpStatusCode.BAD_REQUEST,
                res.error.details
            );
        }
    }
}

async function validateAuthorization(
    event: H3Event<EventHandlerRequest>,
    realm: Realm
) {
    await keycloak.checkAccess(event, realm);
    const { user } = await userManager.syncMyUserWithKc(event, realm);
    event.context.user = user;
}
