export function errorHandler(error: unknown) {
  console.error(error)

  if (error instanceof CustomError) {
    console.error(error.statusCode, error.message, error.details)

    return createError({
      statusCode: error.statusCode,
      statusMessage: error.type,
      message: error.message,
      data: error.details,
    })
  }

  return createError({
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    statusMessage: 'Internal Server Error',
    message: 'An unexpected error occurred',
  })
}
