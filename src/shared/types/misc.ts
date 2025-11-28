import { Realm as RealmOrigin } from "@prisma/client";
import Joi from "joi";

export const Realms = Object.values(RealmOrigin);

const MasterRealm: RealmOrigin = RealmOrigin.master;
const ShareqRealm: RealmOrigin = RealmOrigin.circuless;

export type RealmTypes = typeof MasterRealm | typeof ShareqRealm;

export const clientRealms = Realms.filter((r) => r != RealmOrigin.master);
export interface IdParam {
    id: string;
}

export interface TDIdParam {
    td_id: string;
}

export interface RealmParam {
    realm: RealmTypes;
}

export const IdParamSchema = Joi.object({
    id: Joi.string().required(),
}).required();

export const TDIdParamSchema = Joi.object({
    td_id: Joi.string().required(),
}).required();

export const AllRealmsParamSchema = Joi.object({
    realm: Joi.string()
        .valid(...Realms)
        .required(),
}).required();

export const ClientRealmsParamSchema = Joi.object({
    realm: Joi.string()
        .valid(...clientRealms)
        .required(),
}).required();
