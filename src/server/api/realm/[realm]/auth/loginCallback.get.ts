import { authTypes, miscTypes } from '~/shared/types'

const config = useRuntimeConfig()

defineRouteMeta({
    openAPI: {
        tags: ['Realm Auth'],
        description:
            'Handle login callback from identity provider for the specified realm.',
        parameters: [
            {
                in: 'path',
                name: 'realm',
                schema: { type: 'string', enum: ['circuless'] },
            },
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
    console.log('HEEEY')
    return await apiWrapper(
        event,
        async ({ params, query }) => {
            const realm = params!.realm as miscTypes.RealmTypes
            const redirectUrl = await keycloak.login(
                event,
                query!.code as string,
                query!.state as string,
                realm
            )
            if (redirectUrl) {
                await sendRedirect(event, redirectUrl.toString())
                return
            }
            await sendRedirect(event, `${config.public.APP_URL}/${realm}`)
        },
        {
            schemas: {
                params: miscTypes.ClientRealmsParamSchema,
                query: authTypes.KeycloakAuthCodeQuerySchema,
            },
            protected: false,
        }
    )
})
