import { options } from "joi";
import { method } from "lodash";

export const TDQueries = {
    async upload(body: any) {
        return await $fetch(
            "/WoT%20Directory/create_thing_description_api_v1_things__post",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: body,
            }
        );
    },
};
