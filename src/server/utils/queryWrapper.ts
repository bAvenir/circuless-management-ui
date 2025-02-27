import { Prisma } from '@prisma/client'

export async function queryWrapper<T>(query: () => Promise<T>) {
  try {
    return await query()
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2000':
          _handlePrismaClientKnownRequestError(err, 'Value too long for column', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2001':
          _handlePrismaClientKnownRequestError(err, 'Record not found', HttpStatusCode.NOT_FOUND)
          break
        case 'P2002':
          _handlePrismaClientKnownRequestError(err, 'Unique constraint failed', HttpStatusCode.CONFLICT)
          break
        case 'P2003':
          _handlePrismaClientKnownRequestError(err, 'Foreign key constraint failed', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2004':
          _handlePrismaClientKnownRequestError(err, 'A constraint failed on the database', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2005':
          _handlePrismaClientKnownRequestError(err, 'Invalid value', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2006':
          _handlePrismaClientKnownRequestError(err, 'Invalid value for field', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2007':
          _handlePrismaClientKnownRequestError(err, 'Data validation error', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2008':
          _handlePrismaClientKnownRequestError(err, 'Failed to parse query', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2009':
          _handlePrismaClientKnownRequestError(err, 'Failed to validate query', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2010':
          _handlePrismaClientKnownRequestError(err, 'Raw query failed', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2011':
          _handlePrismaClientKnownRequestError(err, 'Null constraint violation', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2012':
          _handlePrismaClientKnownRequestError(err, 'Missing a required value', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2013':
          _handlePrismaClientKnownRequestError(err, 'Missing the required argument', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2014':
          _handlePrismaClientKnownRequestError(err, 'Relation violation', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2015':
          _handlePrismaClientKnownRequestError(err, 'Related record not found', HttpStatusCode.NOT_FOUND)
          break
        case 'P2016':
          _handlePrismaClientKnownRequestError(err, 'Query interpretation error', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2017':
          _handlePrismaClientKnownRequestError(err, 'Records for relation not connected', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2018':
          _handlePrismaClientKnownRequestError(err, 'Required connected records not found', HttpStatusCode.NOT_FOUND)
          break
        case 'P2019':
          _handlePrismaClientKnownRequestError(err, 'Input error', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2020':
          _handlePrismaClientKnownRequestError(err, 'Value out of range', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2021':
          _handlePrismaClientKnownRequestError(err, 'Table does not exist', HttpStatusCode.NOT_FOUND)
          break
        case 'P2022':
          _handlePrismaClientKnownRequestError(err, 'Column does not exist', HttpStatusCode.NOT_FOUND)
          break
        case 'P2023':
          _handlePrismaClientKnownRequestError(err, 'Inconsistent column data', HttpStatusCode.BAD_REQUEST)
          break
        case 'P2024':
          _handlePrismaClientKnownRequestError(err, 'Timed out', HttpStatusCode.REQUEST_TIMEOUT)
          break
        case 'P2025':
          _handlePrismaClientKnownRequestError(err, 'Resource not found', HttpStatusCode.NOT_FOUND)
          break
        case 'P2026':
          _handlePrismaClientKnownRequestError(err, 'Database server error', HttpStatusCode.INTERNAL_SERVER_ERROR)
          break
        case 'P2027':
          _handlePrismaClientKnownRequestError(err, 'Invalid database connection', HttpStatusCode.INTERNAL_SERVER_ERROR)
          break
        case 'P2028':
          _handlePrismaClientKnownRequestError(err, 'Transaction API error', HttpStatusCode.INTERNAL_SERVER_ERROR)
          break
        case 'P2030':
          _handlePrismaClientKnownRequestError(err, 'Cannot find a fulltext index', HttpStatusCode.NOT_FOUND)
          break
        case 'P2031':
          _handlePrismaClientKnownRequestError(err, 'Connection error', HttpStatusCode.INTERNAL_SERVER_ERROR)
          break
        case 'P2032':
          _handlePrismaClientKnownRequestError(err, 'Insufficient permissions', HttpStatusCode.FORBIDDEN)
          break
        case 'P2033':
          _handlePrismaClientKnownRequestError(err, 'Database error', HttpStatusCode.INTERNAL_SERVER_ERROR)
          break
        case 'P2034':
          _handlePrismaClientKnownRequestError(err, 'Database connection closed', HttpStatusCode.INTERNAL_SERVER_ERROR)
          break
        case 'P2035':
          _handlePrismaClientKnownRequestError(err, 'Database connection timeout', HttpStatusCode.REQUEST_TIMEOUT)
          break
        case 'P2036':
          _handlePrismaClientKnownRequestError(err, 'Database connection refused', HttpStatusCode.INTERNAL_SERVER_ERROR)
          break
        case 'P2037':
          _handlePrismaClientKnownRequestError(err, 'Database connection reset', HttpStatusCode.INTERNAL_SERVER_ERROR)
          break
        default:
          _handlePrismaError(err)
      }
    }
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
      _handlePrismaError(err)
    }
    if (err instanceof Prisma.PrismaClientRustPanicError) {
      _handlePrismaError(err)
    }
    if (err instanceof Prisma.PrismaClientInitializationError) {
      _handlePrismaError(err)
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
      _handlePrismaError(err)
    }
    throw err
  }
}

function _handlePrismaClientKnownRequestError(
  err: Prisma.PrismaClientKnownRequestError,
  clientMessage: string,
  statusCode: HttpStatusCode
) {
  console.error(err.message)
  const code = err.code
  const meta = err.meta
  const name = err.name
  throw new DatabaseError(`${clientMessage} (name: ${name}, code: ${code})`, statusCode, meta)
}

/**
 *
 * @param err Prmisa error
 *
 * This function logs the error and throws a custom error with a generic message to the user.
 * Prisma errors may contain sensitive information like database schema details, lines of code, etc.
 */
function _handlePrismaError(err: Error) {
  console.error(err.message)
  throw new DatabaseError('An error occurred while processing your request.', HttpStatusCode.INTERNAL_SERVER_ERROR)
}
