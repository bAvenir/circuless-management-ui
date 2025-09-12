import { Prisma, Realm } from '@prisma/client'
import type { EventHandlerRequest, H3Event } from 'h3'
import forgeModule from 'node-forge'
import { nodeTypes } from '~/shared/types'
import type { ClientRepresentation } from './keycloak'
import { pki } from './pki'

const forge = forgeModule

interface NodeCreationResult {
  node: Prisma.NodeGetPayload<typeof db.node.args.all>
  certificate: string
  privateKey: string
  kcClient: ClientRepresentation
}

interface NodeCreationCleanup {
  kcClientId?: string
  nodeId?: string
}

class NodeManager {
  create = async (event: H3Event<EventHandlerRequest>, data: nodeTypes.CreateBody): Promise<NodeCreationResult> => {
    const cleanup: NodeCreationCleanup = {}

    try {
      // Step 1: Create Keycloak client
      const clientId = `node_${data.name}`
      const kcClientData: ClientRepresentation = {
        clientId,
        name: `Node Client: ${data.name}`,
        description: `Keycloak client for node: ${data.name}`,
        enabled: true,
        publicClient: false,
        serviceAccountsEnabled: true,
        standardFlowEnabled: false,
        implicitFlowEnabled: false,
        directAccessGrantsEnabled: false,
        authorizationServicesEnabled: false,
        clientAuthenticatorType: 'client-x509',
        attributes: {
          'x509.subjectdn': `CN=${clientId}`,
          'x509.allow.regex.pattern.comparison': 'false',
        },
        protocol: 'openid-connect',
      }

      const { access_token } = await keycloak.getMasterToken(event)
      const kcClient = await keycloak.createClient(event, kcClientData, data.realm, access_token)
      cleanup.kcClientId = kcClient.id!

      // Step 2: Create node in database
      const node = await db.node.queries.create(data, db.node.args.all)
      cleanup.nodeId = node.id

      // Step 3: Generate certificate ID that matches x500UniqueIdentifier
      const certId = `${node.owner?.id || 'system'}-${node.id}`

      // Step 4: Generate CSR and create certificate
      const { csr, privateKey } = _generateCSR(data.name, data.host, node.owner?.id || 'system', certId)
      
      const certificate = await pki.signCertificateRequest({
        csr,
        organisationId: node.owner?.id || 'system', // Use owner organisation ID
        clientName: data.name,
        id: certId, // Use the certificate ID that matches x500UniqueIdentifier
      })

      return {
        node,
        certificate: certificate.certificate,
        privateKey,
        kcClient,
      }
    } catch (error) {
      console.error(`❌ Node creation failed:`, error)
      await _cleanupFailedNodeCreation(event, cleanup, data.realm)
      throw error
    }
  }

  delete = async (event: H3Event<EventHandlerRequest>, nodeId: string, userId: string) => {
    const user = await db.user.queries.get(userId, db.user.args.all)
    const node = await db.node.queries.getUserRealm(nodeId, userId, user.realm, db.node.args.all)

    // Find and delete the associated KC client
    try {
      const { access_token } = await keycloak.getMasterToken(event)
      const clients = await keycloak.getClients(event, node.realm, access_token)
      const kcClient = clients.find((client) => client.clientId === `node_${node.name}`)

      if (kcClient && kcClient.id) {
        await keycloak.deleteClient(event, kcClient.id, node.realm, access_token)
      }
    } catch (error) {
      console.error(`Failed to delete KC client for node ${node.name}:`, error)
      // Continue with node deletion even if KC client deletion fails
    }

    // Delete the node from database
    return await db.node.queries.delete(nodeId, db.node.args.all)
  }

  regenerateCertificate = async (event: H3Event<EventHandlerRequest>, nodeId: string, userId: string) => {
    const user = await db.user.queries.get(userId, db.user.args.all)
    const node = await db.node.queries.getUserRealm(nodeId, userId, user.realm, db.node.args.all)

    // Generate certificate ID that matches x500UniqueIdentifier
    const certId = `${node.owner?.id || 'system'}-${node.id}`

    // Generate new CSR and certificate
    const { csr, privateKey } = _generateCSR(node.name, node.host, node.owner?.id || 'system', certId)

    const certificate = await pki.signCertificateRequest({
      csr,
      organisationId: node.owner?.id || 'system',
      clientName: node.name,
      id: certId, // Use the certificate ID that matches x500UniqueIdentifier
    })

    return {
      certificate: certificate.certificate,
      privateKey,
    }
  }
}

// Private functions

function _generateCSR(name: string, host: string, organisationId: string, certificateId: string): { csr: string; privateKey: string } {
  // Generate a key pair
  const keyPair = forge.pki.rsa.generateKeyPair(2048)

  // Create a certificate signing request
  const csr = forge.pki.createCertificationRequest()

  // Set the subject with proper formatting expected by PKI service
  csr.subject.attributes = [
    {
      type: forge.pki.oids.commonName,
      value: name,
    },
    {
      type: forge.pki.oids.organizationName,
      value: organisationId, // Use the organisation ID directly as company name
    },
    {
      type: forge.pki.oids.organizationalUnitName,
      value: 'IT Department',
    },
    {
      type: forge.pki.oids.localityName,
      value: 'San Francisco',
    },
    {
      type: forge.pki.oids.stateOrProvinceName,
      value: 'California',
    },
    {
      type: forge.pki.oids.countryName,
      value: 'US',
    },
    {
      type: '2.5.4.45', // x500UniqueIdentifier OID - this is what the PKI service expects
      value: certificateId, // Use the full certificate ID that matches the API endpoint
    },
  ]


  // Set the public key
  csr.publicKey = keyPair.publicKey

  // Sign the CSR with the private key
  csr.sign(keyPair.privateKey, forge.md.sha256.create())

  // Convert to PEM format
  const csrPem = forge.pki.certificationRequestToPem(csr)
  const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey)

  return {
    csr: csrPem,
    privateKey: privateKeyPem,
  }
}

async function _cleanupFailedNodeCreation(event: H3Event<EventHandlerRequest>, cleanup: NodeCreationCleanup, realm: Realm) {
  try {
    if (cleanup.kcClientId) {
      const { access_token } = await keycloak.getMasterToken(event)
      await keycloak.deleteClient(event, cleanup.kcClientId, realm, access_token)
    }

    if (cleanup.nodeId) {
      await db.node.queries.delete(cleanup.nodeId, db.node.args.all)
    }
  } catch (cleanupError) {
    console.error('❌ Cleanup failed:', cleanupError)
    // Don't throw cleanup errors, log them and continue
  }
}

export const nodeManager = new NodeManager()
