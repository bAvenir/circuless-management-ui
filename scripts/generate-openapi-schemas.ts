#!/usr/bin/env tsx

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import convert from 'joi-to-swagger'
import * as types from '../src/shared/types/index.js'

// Create output directory
const outputDir = join(process.cwd(), 'src', 'server', 'schemas')
mkdirSync(outputDir, { recursive: true })

// Helper function to convert Joi schema to OpenAPI
function convertJoiToOpenAPI(joiSchema: any, name: string) {
  try {
    const { swagger } = convert(joiSchema, { title: name })
    return JSON.parse(JSON.stringify(swagger))
  } catch (error) {
    console.warn(`Failed to convert schema ${name}:`, error)
    return null
  }
}

// Generate schemas for all types
const schemas: Record<string, any> = {}

// Node schemas
if (types.nodeTypes.CreateBodySchema) {
  schemas.NodeCreateBody = convertJoiToOpenAPI(types.nodeTypes.CreateBodySchema, 'NodeCreateBody')
}

if (types.nodeTypes.CreateBodyRealmSchema) {
  schemas.NodeCreateBodyRealm = convertJoiToOpenAPI(types.nodeTypes.CreateBodyRealmSchema, 'NodeCreateBodyRealm')
}

// Organisation schemas
if (types.organisationTypes.CreateBodyMasterSchema) {
  schemas.OrganisationCreateBodyMaster = convertJoiToOpenAPI(types.organisationTypes.CreateBodyMasterSchema, 'OrganisationCreateBodyMaster')
}

if (types.organisationTypes.UpdateBodyRealmSchema) {
  schemas.OrganisationUpdateBodyRealm = convertJoiToOpenAPI(types.organisationTypes.UpdateBodyRealmSchema, 'OrganisationUpdateBodyRealm')
}

if (types.organisationTypes.RemoveUserBodyRealmSchema) {
  schemas.OrganisationRemoveUserBodyRealm = convertJoiToOpenAPI(types.organisationTypes.RemoveUserBodyRealmSchema, 'OrganisationRemoveUserBodyRealm')
}

// User schemas
if (types.userTypes.InviteBodyMasterSchema) {
  schemas.UserInviteBodyMaster = convertJoiToOpenAPI(types.userTypes.InviteBodyMasterSchema, 'UserInviteBodyMaster')
}

if (types.userTypes.InviteBodyRealmSchema) {
  schemas.UserInviteBodyRealm = convertJoiToOpenAPI(types.userTypes.InviteBodyRealmSchema, 'UserInviteBodyRealm')
}

// Partnership schemas
if (types.partnershipTypes.CreateBodySchema) {
  schemas.PartnershipCreateBody = convertJoiToOpenAPI(types.partnershipTypes.CreateBodySchema, 'PartnershipCreateBody')
}

// Filter out null schemas
const validSchemas = Object.fromEntries(
  Object.entries(schemas).filter(([, schema]) => schema !== null)
)

// Generate copy-pasteable schemas
const schemaEntries = Object.entries(validSchemas).map(([name, schema]) => {
  return `/* ${name} - Copy this schema for defineRouteMeta */
${JSON.stringify(schema, null, 2)}`
}).join('\n\n')

// Generate the output file
const outputContent = `// Auto-generated OpenAPI schemas from Joi schemas
// Generated on: ${new Date().toISOString()}
// 
// Usage: Copy the schema object below and paste it into your defineRouteMeta
// 
// Example:
// defineRouteMeta({
//   openAPI: {
//     tags: ['Master Node'],
//     requestBody: {
//       content: {
//         'application/json': {
//           schema: { /* paste schema here */ }
//         }
//       }
//     }
//   }
// })

${schemaEntries}
`

writeFileSync(join(outputDir, 'generated.txt'), outputContent, 'utf8')

console.log(`✅ Generated ${Object.keys(validSchemas).length} copy-pasteable OpenAPI schemas`)
console.log(`📁 Output: ${join(outputDir, 'generated.txt')}`)
console.log(`📋 Available schemas: ${Object.keys(validSchemas).join(', ')}`)