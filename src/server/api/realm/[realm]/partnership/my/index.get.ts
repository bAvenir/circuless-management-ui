import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Partnership'],
        description:
            "Get all partnerships for the user's organisation in the specified realm.",
        parameters: [
            {
                in: 'path',
                name: 'realm',
                schema: { type: 'string', enum: ['circuless'] },
            },
        ],
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ user }) => {
            if (!user?.organisationId) {
                throw new ApplicationError(
                    'User has no organisation',
                    HttpStatusCode.FORBIDDEN
                )
            }
            const [ingressPartnerships, egressPartnerships] = await Promise.all(
                [
                    db.partnership.queries.getAllOrganisationIngress(
                        user.organisationId,
                        db.partnership.args.all
                    ),
                    db.partnership.queries.getAllOrganisationEgress(
                        user.organisationId,
                        db.partnership.args.all
                    ),
                ]
            )
            return {
                ingressPartnerships,
                egressPartnerships,
            }
        },
        {
            protected: true,
            schemas: {
                params: miscTypes.ClientRealmsParamSchema,
            },
        }
    )
})
