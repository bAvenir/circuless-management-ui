import { Realm } from '@prisma/client'
import { authTypes } from '~/shared/types'

const config = useRuntimeConfig()

defineRouteMeta({
    openAPI: {
        tags: ['Master Auth'],
        description:
            'Initiate logout process with identity provider for the Master realm.',
        parameters: [
            {
                in: 'query',
                name: 'redirectUri',
                schema: { type: 'string' },
                required: false,
                description: 'The URI to redirect to after logout.',
            },
        ],
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ query }) => {
            const redirectUri = query?.redirectUri as string | undefined
            const redirectUrl = await keycloak.logout(
                event,
                'master',
                redirectUri
            )
            if (redirectUrl) {
                await sendRedirect(event, redirectUrl.toString())
                return
            }
            await sendRedirect(event, `${config.public.APP_URL}/`)
        },
        {
            protected: Realm.master,
            schemas: {
                query: authTypes.AuthQuerySchema,
            },
        }
    )
})
