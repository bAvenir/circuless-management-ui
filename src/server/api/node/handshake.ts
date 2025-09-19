import { Realm } from '@prisma/client'

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) {
      throw new ApplicationError('Authorization header is required', HttpStatusCode.UNAUTHORIZED)
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new ApplicationError('Invalid authorization format. Expected Bearer token', HttpStatusCode.UNAUTHORIZED)
    }

    const token = authHeader.substring(7)
    if (!token) {
      throw new ApplicationError('Token is required', HttpStatusCode.UNAUTHORIZED)
    }

    const realm: Realm = Realm.circuless
    const claims = await keycloak.verifyToken(token, realm)
    // const validatedClaims = keycloak.validateClaims({ context: { claims } } as any)

    return {
      success: true,
      message: 'Token verified successfully',
      claims,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    if (error instanceof ApplicationError && error.statusCode === HttpStatusCode.UNAUTHORIZED) {
      setResponseStatus(event, HttpStatusCode.UNAUTHORIZED)
      return {
        success: false,
        message: 'Token verification failed',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }

    console.error('Handshake error:', error)
    setResponseStatus(event, HttpStatusCode.INTERNAL_SERVER_ERROR)
    return {
      success: false,
      message: 'Internal server error during token verification',
      timestamp: new Date().toISOString()
    }
  }
})
