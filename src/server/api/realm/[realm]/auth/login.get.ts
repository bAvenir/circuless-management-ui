import { authTypes, miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Auth'],
        description:
            'Initiate login process with identity provider for the specified realm.',
        parameters: [
            {
                in: 'path',
                name: 'realm',
                schema: { type: 'string', enum: ['circuless'] },
            },
            {
                in: 'query',
                name: 'redirectUri',
                schema: { type: 'string' },
                required: false,
                description: 'The URI to redirect to after login.',
            },
        ],
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ params, query }) => {
            const realm = params!.realm as miscTypes.RealmTypes
            const redirectUri = query?.redirectUri as string | undefined
            const authRedirectUrl = await keycloak.getRedirectUrl(
                event,
                realm,
                false,
                redirectUri
            )
            await sendRedirect(event, authRedirectUrl.toString())
        },
        {
            schemas: {
                params: miscTypes.ClientRealmsParamSchema,
                query: authTypes.AuthQuerySchema,
            },
            protected: false,
        }
    )
})
