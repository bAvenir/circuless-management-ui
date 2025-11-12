import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Partnership'],
        description:
            "Delete egress partnership by its ID within the user's organisation.",
        parameters: [
            {
                in: 'path',
                name: 'realm',
                schema: { type: 'string', enum: ['circuless'] },
            },
            {
                in: 'path',
                name: 'id',
                schema: { type: 'string', format: 'uuid' },
            },
        ],
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ user, params }) => {
            if (!user?.organisationId) {
                throw new ApplicationError(
                    'User has no organisation',
                    HttpStatusCode.FORBIDDEN
                )
            }

            return await db.partnership.queries.deleteOrganisationEgress(
                params!.id,
                user.organisationId,
                db.partnership.args.all
            )
        },
        {
            protected: true,
            schemas: {
                params: miscTypes.AllRealmsParamSchema.concat(
                    miscTypes.IdParamSchema
                ),
            },
        }
    )
})
