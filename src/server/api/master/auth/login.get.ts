import { authTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Master Auth'],
        description:
            'Initiate login process with identity provider for the Master realm.',
        parameters: [
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
        async ({ query }) => {
            const redirectUri = query?.redirectUri as string | undefined
            const authRedirectUrl = await keycloak.getRedirectUrl(
                event,
                'master',
                false,
                redirectUri
            )
            await sendRedirect(event, authRedirectUrl.toString())
        },
        {
            schemas: {
                query: authTypes.AuthQuerySchema,
            },
            protected: false,
        }
    )
})
