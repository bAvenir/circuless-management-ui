import { authTypes } from '~/shared/types'

const config = useRuntimeConfig()

defineRouteMeta({
    openAPI: {
        tags: ['Master Auth'],
        description:
            'Processes the authorization code returned by the identity provider for the Master realm.',
        parameters: [
            {
                in: 'query',
                name: 'iss',
                schema: { type: 'string' },
                required: true,
                description: 'The issuer of the authorization code.',
            },
            {
                in: 'query',
                name: 'code',
                schema: { type: 'string' },
                required: true,
                description:
                    'The authorization code returned by the identity provider.',
            },
            {
                in: 'query',
                name: 'state',
                schema: { type: 'string' },
                required: true,
                description: 'The state parameter to prevent CSRF attacks.',
            },
            {
                in: 'query',
                name: 'session_state',
                schema: { type: 'string' },
                required: true,
                description:
                    'The session state returned by the identity provider.',
            },
        ],
    },
})

export default defineEventHandler(async (event) => {
    console.log('LOGIN CALLBACK HIT')
    return await apiWrapper(
        event,
        async ({ query }) => {
            const redirectUrl = await keycloak.login(
                event,
                query!.code as string,
                query!.state as string,
                'master'
            )
            if (redirectUrl) {
                await sendRedirect(event, redirectUrl.toString())
                return
            }
            await sendRedirect(event, `${config.public.APP_URL}/master`)
        },
        {
            schemas: {
                query: authTypes.KeycloakAuthCodeQuerySchema,
            },
            protected: false,
        }
    )
})
