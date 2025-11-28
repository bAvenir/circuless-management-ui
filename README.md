# Circuless Management UI

Circuless Management UI is a Nuxt 3 application. It provides a comprehensive platform for managing the Circuless ecosystem, enabling users to register nodes, manage partnerships, and handle organization data.

## Dependencies
- PrimeVue
- TailwindCSS
- Pinia
- Prisma
- Postgresql
- Joi
- Keycloak

## Getting Started

This is a Nuxt 3 application with TypeScript support. Follow the standard process:

1. Install dependencies:
    ```bash
    npm install
    ```

2. Provide the necessary configuration in your environment variables and database setup.

3. Start the development server:
    ```bash
    npm run dev
    ```

> **Note:** Make sure to configure your database connection and environment variables before starting the application.

## Database Setup

The application uses Prisma ORM with PostgreSQL. Run database migrations:

```bash
npx prisma migrate dev
```

Seed the database (optional):
```bash
npx prisma db seed
```

## OpenAPI Schema Generation

Generate OpenAPI schemas from Joi validation schemas:

```bash
npm run generate:schemas
```

This creates copy-pasteable schemas in `src/server/schemas/generated.txt`. Copy the schema objects into `defineRouteMeta` for OpenAPI documentation.

**Example:**
```typescript
defineRouteMeta({
  openAPI: {
    requestBody: {
      content: {
        'application/json': {
          schema: { /* paste generated schema here */ }
        }
      }
    }
  }
})
```

**Note:** Due to Nitro macro limitations, schemas must be manually copied - dynamic variables don't work in `defineRouteMeta`. GitHub issue: https://github.com/nitrojs/nitro/issues/2974

## Deploy

Build the application for production and deploy using Docker:

```bash
./buildAndPublish.sh
```

Or use Docker Compose for local deployment:

```bash
docker-compose up -d
```

> **Note:** Application container will be restarted automatically.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production with type checking
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build locally
- `npm run typecheck` - Run TypeScript type checking
- `npm run generate:schemas` - Generate OpenAPI schemas from Joi
- `npm run generate:openapi` - Generate OpenAPI documentation

## Project Structure

- `/src/api/` - API routes organized by realm (circuless, master, realm-specific)
- `/src/components/` - Vue components organized by feature
- `/src/pages/` - File-based routing pages
- `/src/server/` - Nitro server-side functionality
- `/prisma/` - Database schema and migrations
- `/lib/` - Shared utilities and configurations

## Project Architecture

### Multi-Realm Architecture

This application is architected to serve multiple isolated client projects from a single codebase using Keycloak realms. This eliminates the need to fork, clone, or maintain separate codebases for each new project.

#### Realm Types

The application supports two types of realms:

1. **Master Realm** (`master`) - A hardcoded administrative realm providing a CMS-like backoffice dashboard. Admins can configure all aspects of client realms plus additional master-only features.

2. **Client Realms** (e.g., `circuless`) - Each client project gets its own isolated Keycloak realm with complete separation of users, organizations, nodes, and data. New clients can be added by simply updating configuration - no code changes required.

#### Architecture Diagram

```mermaid
graph TD
    A[Single Codebase/Deployment] --> B[Master Realm]
    A --> C[Client Realm: circuless]
    A --> D[Client Realm: future-project]
    A --> E[Client Realm: another-project]
    
    B --> B1[Backoffice Admin Dashboard]
    B --> B2[Configure All Realms]
    B --> B3[Master-Only Features]
    
    C --> C1[Isolated Users & Orgs]
    C --> C2[Shared Generic Routes]
    C --> C3[Circuless-Specific Features]
    
    D --> D1[Isolated Users & Orgs]
    D --> D2[Shared Generic Routes]
    D --> D3[Project-Specific Features]
    
    E --> E1[Isolated Users & Orgs]
    E --> E2[Shared Generic Routes]
    E --> E3[Project-Specific Features]
    
    style B fill:#e1f5ff
    style C fill:#fff4e1
    style D fill:#fff4e1
    style E fill:#fff4e1
```

#### Request Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Middleware
    participant Keycloak
    participant API
    participant DB
    
    User->>App: Navigate to /circuless/organisation-admin
    App->>Middleware: realm-auth.ts middleware
    Middleware->>API: Check access /api/realm/circuless/auth/checkAccess
    API->>Keycloak: Verify session for circuless realm
    Keycloak-->>API: Session valid/invalid
    
    alt Session Valid
        API-->>Middleware: Access granted
        Middleware-->>App: Continue to page
        App->>API: Fetch data /api/realm/circuless/organisation
        API->>Keycloak: Verify access token
        Keycloak-->>API: Token valid
        API->>DB: Query data for circuless realm
        DB-->>API: Return data
        API-->>App: Return realm-scoped data
        App-->>User: Render page
    else Session Invalid
        API-->>Middleware: Access denied
        Middleware->>Keycloak: Redirect to /api/realm/circuless/auth/login
        Keycloak-->>User: Show login page
    end
```

### Folder Structure Conventions

The codebase follows strict conventions to separate shared (generic) code from realm-specific implementations:

#### API Routes (`src/server/api/`)

- **`/master/`** - Master realm-specific endpoints (e.g., `/api/master/auth/login`)
- **`/realm/[realm]/`** - Dynamic endpoints shared across all client realms (e.g., `/api/realm/circuless/user`)
- **`/circuless/`** - Circuless-specific endpoints not applicable to other clients (e.g., `/api/circuless/marketplace`)
- **`/node/`** - Global endpoints not tied to any specific realm

**Rule**: If functionality should be available to all client realms, use `/realm/[realm]/`. If it's specific to one client project, create a dedicated folder.

#### Components (`src/components/`)

- **`/realm/`** - Generic components reusable across all client realms
  - Example: `realm/header/`, `realm/partnership/`, `realm/user/`
- **`/master/`** - Master realm-specific components
- **`/circuless/`** - Circuless-specific components

**Rule**: Components in `/realm/` must not contain hardcoded client-specific logic. Use props and dynamic realm parameters instead.

#### Pages (`src/pages/`)

- **`/master.vue` + `/master/`** - Master realm entry point and pages
- **`/[realm]/`** - Dynamic pages shared across all client realms (e.g., `/[realm]/organisation-admin.vue`)
- **`/circuless.vue` + `/circuless/`** - Circuless entry point and specific pages

**Rule**: Each new client realm requires at minimum its own entry point page (e.g., `/mynewrealm.vue`) but can reuse all `/[realm]/` dynamic pages.

#### Middleware (`src/middleware/`)

- **`master-auth.ts`** - Authentication middleware for master realm
- **`realm-auth.ts`** - Generic authentication middleware for any client realm (extracts realm from route params)
- **`circuless-auth.ts`** - Circuless-specific authentication middleware (hardcoded to circuless realm)

### Authentication & Session Management

Each realm has completely isolated authentication using Keycloak:

#### Middleware Pattern

Pages use `definePageMeta` to specify which middleware to apply:

```typescript
// Master realm page
definePageMeta({
  middleware: ['master-auth'],
})

// Dynamic realm page (extracts realm from route params)
definePageMeta({
  middleware: ['realm-auth'],
})

// Circuless-specific page
definePageMeta({
  middleware: ['circuless-auth'],
})
```

The middleware checks access via API calls to `/api/[realm]/auth/checkAccess` and redirects to login if needed.

#### Session Storage

Sessions are stored with realm-prefixed cookies (e.g., `circuless_session_id`, `master_session_id`) to enable:
- Isolated authentication per realm
- Separate token management for each realm
- Independent session lifecycles

**Note**: The current implementation uses an in-memory `SessionStore` suitable for development. For production with horizontal scaling, consider using Redis or another distributed session store.

#### Authentication Flow

1. User navigates to a protected page (e.g., `/circuless/organisation-admin`)
2. Middleware (`realm-auth.ts`) checks for active session via `/api/realm/circuless/auth/checkAccess`
3. If no session exists, user is redirected to `/api/realm/circuless/auth/login`
4. Keycloak handles authentication and redirects to `/api/realm/circuless/auth/loginCallback`
5. Server exchanges auth code for tokens and creates session with realm-prefixed cookie
6. User is redirected back to original page
7. Subsequent requests include session cookie for token verification

### Adding a New Client Realm

Adding a new client project requires only configuration changes - no code forking:

#### Step 1: Update Prisma Realm Enum

Add the new realm to `prisma/models/misc.prisma`:

```prisma
enum Realm {
  master
  circuless
  mynewproject  // Add your new realm here
}
```

#### Step 2: Run Database Migration

```bash
npx prisma migrate dev --name add_mynewproject_realm
```

#### Step 3: Configure Keycloak

In your Keycloak instance:

1. Create a new realm named `mynewproject`
2. Create a client in that realm with:
   - Client ID: `mynewproject`
   - Client authentication: ON
   - Valid redirect URIs: `${NUXT_PUBLIC_APP_URL}/api/realm/mynewproject/auth/loginCallback`
   - Generate and save the client secret

#### Step 4: Update Environment Variables

Update your `.env` file with the new realm configuration:

```bash
# Add to NUXT_PUBLIC_OIDC_REALMS (publicly visible configuration)
NUXT_PUBLIC_OIDC_REALMS='{
   "master":{
      "client_id":"admin",
      "realm":"master"
   },
   "circuless":{
      "client_id":"circuless",
      "realm":"circuless"
   },
   "mynewproject":{
      "client_id":"mynewproject",
      "realm":"mynewproject"
   }
}'

# Add to NUXT_OIDC_REALM_SECRETS (server-side only, keep secret!)
NUXT_OIDC_REALM_SECRETS='{
   "master":"master-client-secret",
   "circuless":"circuless-client-secret",
   "mynewproject":"mynewproject-client-secret"
}'
```

**Security Note**: Never commit real client secrets to version control. Use `.env` files locally and secure environment variable management in production.

#### Step 5: Create Entry Point Page

Create a new entry point at `src/pages/mynewproject.vue`:

```vue
<template>
  <div class="w-full h-full lg:flex lg:flex-col">
    <MyNewProjectHeader :my="my" :loading="loading" class="fixed lg:inherit top-0 left-0 w-full z-50" />
    <div class="w-full lg:grow bg-whitesmoke bg-opacity-20 pt-14 lg:overflow-y-auto">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Realm } from '@prisma/client'
import { useRealmUserStore } from '~/stores/realm/user'

definePageMeta({
  middleware: ['mynewproject-auth'],
})

const realmUserStore = useRealmUserStore()
const { my, loading } = storeToRefs(realmUserStore)

await callOnce(async () => {
  await realmUserStore.getMy(Realm.mynewproject)
})
</script>
```

#### Step 6: Add Realm Link to Home Page (Optional)

Update `src/pages/index.vue` to include a link to your new realm:

```vue
<NuxtLink to="/mynewproject" class="w-full">
  <Button class="w-full">My New Project</Button>
</NuxtLink>
```

#### Step 7: Restart Application

```bash
npm run dev
```

Your new client realm is now fully functional with access to all shared routes and components!

### Routing Patterns

The application uses Nuxt's dynamic routing to maximize code reuse:

#### Dynamic API Routes

Example: `src/server/api/realm/[realm]/auth/login.get.ts`

```typescript
export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ params, query }) => {
            const realm = params!.realm as miscTypes.RealmTypes // Extract realm from URL
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
```

This single file handles login for all client realms: `/api/realm/circuless/auth/login`, `/api/realm/mynewproject/auth/login`, etc.

#### Dynamic Pages

Example: `src/pages/[realm]/organisation-admin.vue`

```typescript
definePageMeta({
  middleware: ['realm-auth'], // Automatically validates based on realm in URL
})

const route = useRoute()
const realm = ref(route.params.realm as Realm) // Extract realm from route params

await callOnce(async () => {
  await realmUserStore.getMy(realm.value) // Use realm dynamically
})
```

This allows URLs like `/circuless/organisation-admin`, `/mynewproject/organisation-admin` to use the same page component.

#### Client-Specific Routes

When functionality is specific to one client, create dedicated routes:

- **Static page**: `src/pages/circuless/marketplace/index.vue` → `/circuless/marketplace`
- **Static API**: `src/server/api/circuless/marketplace/index.get.ts` → `/api/circuless/marketplace`

These won't be accessible to other client realms.

### Benefits of This Architecture

1. **Zero Code Duplication** - One codebase serves unlimited client projects
2. **Easy Maintenance** - Bug fixes and features automatically available to all clients
3. **Fast Onboarding** - New client projects ready in minutes via configuration
4. **Complete Isolation** - Each client has separate users, data, and Keycloak realm
5. **Flexible Customization** - Client-specific features can be added without affecting others
6. **Type Safety** - Prisma enum ensures compile-time validation of realm values

---

## Advanced Features

This section documents complex, non-obvious features that require special explanation for developers working with this codebase. These features implement sophisticated patterns and integrations that go beyond standard CRUD operations.

### Node Registration with mTLS Authentication

The node registration system implements enterprise-grade **Mutual TLS (mTLS) authentication** using Keycloak's X.509 client certificate authentication. This feature enables platform nodes (external services) to authenticate and obtain access tokens without user interaction via **service account flows**.

#### Overview

When a node is registered, the system:
1. Creates a Keycloak client configured for X.509 certificate authentication
2. Generates an RSA 2048-bit key pair and Certificate Signing Request (CSR)
3. Signs the CSR using an external PKI service to obtain a client certificate
4. Returns the certificate and private key to the user for deployment
5. Enables the node to authenticate with Keycloak using the certificate to obtain JWT access tokens

This eliminates the need for shared secrets and provides strong cryptographic identity verification for service-to-service authentication.

#### Complete Registration Flow

The following diagram illustrates the end-to-end node registration process:

```mermaid
sequenceDiagram
    participant User
    participant UI as UI Component
    participant API as API Endpoint
    participant KC as Keycloak
    participant DB as PostgreSQL
    participant PKI as PKI Service
    
    User->>UI: Fill node registration form
    Note over UI: Name, Host, Realm, Roles, Owner
    UI->>API: POST /api/master/node<br/>or /api/realm/{realm}/node
    
    API->>KC: Create client with x509 auth
    Note over KC: clientAuthenticatorType: 'client-x509'<br/>serviceAccountsEnabled: true
    KC-->>API: Client created (clientId: node_*)
    
    API->>KC: Get service account user
    KC-->>API: Service account user ID
    
    API->>KC: Add service account to organization
    KC-->>API: User added to org
    
    API->>DB: Create node record
    DB-->>API: Node created
    
    API->>API: Generate CSR + RSA key pair
    Note over API: CN=node_*, O=orgId<br/>x500UniqueIdentifier=orgId-nodeId
    
    API->>PKI: POST /pki/certificates/{certId}<br/>with CSR (PEM)
    Note over PKI: Sign CSR with Intermediate CA
    PKI-->>API: Signed X.509 certificate (PEM)
    
    API-->>UI: Return certificate + private key
    UI->>User: Download certificate file
    Note over User: Certificate contains both<br/>cert and private key in PEM format
```

#### Step-by-Step Implementation

##### 1. Keycloak Client Creation with mTLS Configuration

**File:** `src/server/utils/nodeManager.ts` (Lines 23-50)

When a node is registered, a Keycloak client is created with specific mTLS settings:

```typescript
const clientId = `node_${data.name}` // e.g., "node_bAvenir"

const kcClientData: ClientRepresentation = {
  clientId,
  name: `Node Client: ${data.name}`,
  enabled: true,
  publicClient: false,
  
  // Service account configuration - enables machine-to-machine auth
  serviceAccountsEnabled: true,
  standardFlowEnabled: false,
  implicitFlowEnabled: false,
  directAccessGrantsEnabled: false,
  authorizationServicesEnabled: false,
  
  // X.509 certificate authentication configuration
  clientAuthenticatorType: 'client-x509',
  
  // Certificate validation attributes
  attributes: {
    // Regex pattern to validate certificate's Subject DN (Distinguished Name)
    // Keycloak will extract CN from the certificate and match against this pattern
    'x509.subjectdn': `.*CN=${clientId}*`,
    
    // Enable regex pattern matching for flexible certificate validation
    'x509.allow.regex.pattern.comparison': 'true',
  },
  
  protocol: 'openid-connect',
}

// Create the client in Keycloak
const kcClient = await keycloak.createClient(
  event,
  kcClientData,
  data.realm,
  access_token
)
```

**Key Configuration Attributes:**

- **`clientAuthenticatorType: 'client-x509'`** - Tells Keycloak to authenticate this client using X.509 certificates instead of traditional client secrets. Keycloak will validate the certificate's Subject DN against the configured pattern.

- **`serviceAccountsEnabled: true`** - Creates a service account user that represents the node itself. This user can obtain access tokens without human interaction using the OAuth 2.0 client credentials grant flow.

- **`x509.subjectdn`** - Regular expression pattern that Keycloak uses to validate the certificate's Common Name (CN). The certificate's CN must match this pattern for authentication to succeed.

- **`x509.allow.regex.pattern.comparison: 'true'`** - Enables regex pattern matching instead of exact string comparison, allowing flexible certificate validation rules.

**API Endpoint:** `POST {KEYCLOAK_URL}/admin/realms/{realm}/clients`

##### 2. Service Account User Retrieval and Organization Assignment

**Files:** 
- `src/server/utils/nodeManager.ts` (Lines 52-58)
- `src/server/utils/keycloak.ts` (Lines 811-829, 659-687)

After creating the Keycloak client, the system retrieves the automatically-created service account user and associates it with the node owner's organization:

```typescript
// Retrieve the service account user associated with this client
const clientServiceAccount = await keycloak.getClientServiceAccount(
  event,
  kcClient.id!,
  data.realm,
  access_token
)
// Returns: { id: "uuid", username: "service-account-node_bavenir", ... }

// Add the service account to the organization for access control
const organisation = await db.organisation.queries.get(data.ownerId)
await keycloak.addUserToOrganisation(
  event,
  clientServiceAccount.id,    // Service account user ID
  organisation.kcId,           // Organization ID in Keycloak
  data.realm,
  access_token
)
```

**Implementation in `keycloak.ts`:**

```typescript
// Get service account user for a client
async getClientServiceAccount(
  event: H3Event,
  clientId: string,
  realm: Realm,
  token: string
): Promise<UserRepresentation> {
  const response = await $fetch<UserRepresentation>(
    `${this.endpoint}/admin/realms/${realm}/clients/${clientId}/service-account-user`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response
}

// Add user to organization
async addUserToOrganisation(
  event: H3Event,
  userId: string,
  organisationId: string,
  realm: Realm,
  token: string
): Promise<void> {
  await $fetch(
    `${this.endpoint}/admin/realms/${realm}/organizations/${organisationId}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId }),
    }
  )
}
```

**Purpose:** This associates the service account with the node owner's Keycloak organization, enabling organization-scoped access control and permissions. The service account inherits the organization's roles and policies.

##### 3. Database Record Creation

**File:** `src/server/utils/nodeManager.ts` (Lines 60-61)

**Prisma Schema:** `prisma/models/node.prisma`

```prisma
model Node {
  id      String     @id @default(cuid())
  name    String
  host    String                    // DNS hostname (e.g., "bavenir.eu")
  access  NodeAccess @default(direct)
  status  NodeStatus @default(pending)
  roles   NodeRole[] @default([])   // Array: [platform, consumer, provider]
  version String?
  realm   Realm
  
  // Relationship to organization (cascade delete)
  owner   Organisation @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  ownerId String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Unique constraint: one host per realm
  @@unique([host, realm])
}
```

**Database Creation:**

```typescript
const node = await db.node.queries.create({
  name: data.name,
  host: data.host,
  realm: data.realm,
  roles: data.roles,
  access: data.access,
  ownerId: data.ownerId,
  status: 'pending',
})
```

**Important Fields:**
- **`host`** - Must be a valid DNS hostname, unique per realm
- **`realm`** - Keycloak realm (Prisma enum: `master`, `circuless`, etc.)
- **`ownerId`** - Links to Organization with cascade delete enabled
- **`status`** - Initially `pending`, can be updated to `approved` by admins

##### 4. Certificate Signing Request (CSR) Generation

**File:** `src/server/utils/nodeManager.ts` (Lines 139-191)  
**Library:** `node-forge` (RSA key generation and X.509 CSR creation)

The system generates a CSR with an RSA 2048-bit key pair and X.509 subject attributes:

```typescript
import * as forge from 'node-forge'

function _generateCSR(
  clientId: string,        // e.g., "node_bAvenir"
  host: string,            // e.g., "bavenir.eu"
  organisationId: string,  // e.g., "clx123abc"
  certificateId: string    // e.g., "clx123abc-cly456def"
): { csr: string; privateKey: string } {
  
  // Generate RSA 2048-bit key pair
  const keyPair = forge.pki.rsa.generateKeyPair({
    bits: 2048,
    workers: -1,  // Use Web Workers if available
  })
  
  // Create Certificate Signing Request
  const csr = forge.pki.createCertificationRequest()
  csr.publicKey = keyPair.publicKey
  
  // Set X.509 Subject attributes (Distinguished Name)
  csr.setSubject([
    {
      name: 'commonName',
      value: clientId,  // CN=node_bAvenir (CRITICAL: must match KC x509.subjectdn)
    },
    {
      name: 'organizationName',
      value: organisationId,  // O=clx123abc
    },
    {
      name: 'organizationalUnitName',
      value: 'IT Department',  // OU=IT Department
    },
    {
      name: 'localityName',
      value: 'San Francisco',  // L=San Francisco
    },
    {
      name: 'stateOrProvinceName',
      value: 'California',  // ST=California
    },
    {
      name: 'countryName',
      value: 'US',  // C=US
    },
  ])
  
  // Add x500UniqueIdentifier as an additional attribute
  // This MUST match the PKI service endpoint URL path
  csr.setAttributes([
    {
      name: 'x500UniqueIdentifier',
      value: certificateId,  // clx123abc-cly456def
    },
  ])
  
  // Sign the CSR with the private key using SHA-256
  csr.sign(keyPair.privateKey, forge.md.sha256.create())
  
  // Convert to PEM format (Privacy Enhanced Mail - Base64 encoded)
  const csrPem = forge.pki.certificationRequestToPem(csr)
  const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey)
  
  return {
    csr: csrPem,           // -----BEGIN CERTIFICATE REQUEST-----...
    privateKey: privateKeyPem,  // -----BEGIN RSA PRIVATE KEY-----...
  }
}

// Usage in node creation flow
const certId = `${node.owner?.id || 'system'}-${node.id}`
// Example: "clx123abc-cly456def"

const { csr, privateKey } = _generateCSR(
  `node_${node.name}`,
  node.host,
  node.owner?.id || 'system',
  certId
)
```

**Critical Detail - Certificate ID Format:**

The certificate ID is constructed as `{organisationId}-{nodeId}` and embedded in the CSR's **x500UniqueIdentifier** field. This ID **MUST match** the PKI service endpoint URL for certificate retrieval:

```
POST https://pki.circuless.bavenir.eu/pki/certificates/clx123abc-cly456def
                                                        └── Must match x500UniqueIdentifier
```

**Generated CSR Example (PEM format):**

```
-----BEGIN CERTIFICATE REQUEST-----
MIICvjCCAaYCAQAwdzEVMBMGA1UEAwwMbm9kZV9iQXZlbmlyMRMwEQYDVQQKDAp
jbHgxMjNhYmMxFzAVBgNVBAsMDklUIERlcGFydG1lbnQxFjAUBgNVBAcMDVNhbiBG
cmFuY2lzY28xEzARBgNVBAgMCkNhbGlmb3JuaWExCzAJBgNVBAYTAlVTMIIBIjAN
BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw7QdF9...
...
-----END CERTIFICATE REQUEST-----
```

##### 5. PKI Service Integration for Certificate Signing

**File:** `src/server/utils/pki.ts` (Lines 93-119)

The CSR is sent to an external PKI service that signs it with its Intermediate CA certificate:

```typescript
export class PkiService {
  private endpoint: string
  private user: string
  private password: string
  
  constructor() {
    const config = useRuntimeConfig()
    this.endpoint = config.pkiUrl         // https://pki.circuless.bavenir.eu
    this.user = config.pkiUser            // 'cc'
    this.password = config.pkiPassword    // 'fW9z0uY5aVhSgJBcZdoG'
  }
  
  /**
   * Sign a Certificate Signing Request (CSR) using the PKI service
   */
  async signCertificateRequest(
    options: CertificateSigningOptions
  ): Promise<SignedCertificateResult> {
    const certId = options.id  // e.g., "clx123abc-cly456def"
    
    // Create Basic Authentication header
    const authString = `${this.user}:${this.password}`
    const authHeader = `Basic ${Buffer.from(authString).toString('base64')}`
    
    try {
      // Send CSR to PKI service for signing
      const cert = await $fetch<MyCertType>(
        `${this.endpoint}/pki/certificates/${certId}`,
        {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-pem-file',
          },
          body: options.csr,  // PEM-encoded CSR
        }
      )
      
      return {
        certificate: cert.cert_pem,  // Signed X.509 certificate in PEM format
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to sign certificate request',
      })
    }
  }
}
```

**Environment Variables Configuration (`.env`):**

```bash
# PKI Service Configuration
NUXT_PKI_URL='https://pki.circuless.bavenir.eu'
NUXT_PKI_USER='cc'
NUXT_PKI_PASSWORD='fW9z0uY5aVhSgJBcZdoG'
```

**PKI Service Response:**

```typescript
interface MyCertType {
  cert_id: string          // "clx123abc-cly456def"
  serial_number: string    // Certificate serial number (hex)
  cert_pem: string         // PEM-encoded signed X.509 certificate
  issued: string           // ISO 8601 timestamp (e.g., "2024-11-28T10:00:00Z")
  expires: string          // ISO 8601 timestamp (e.g., "2025-11-28T10:00:00Z")
  revoked: boolean         // false (initially)
  revoked_date: string     // null (until revoked)
}
```

**Certificate Chain:**

The PKI service signs the CSR with its **Intermediate CA certificate**, creating a complete certificate chain:

1. **Root CA** (trust anchor - installed in Keycloak's truststore)
2. **Intermediate CA** (signing authority operated by PKI service)
3. **Client Certificate** (issued to the node for mTLS authentication)

**Example Signed Certificate (PEM format):**

```
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0k9F3mYxZMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkVVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm1lZGlh
dGUgQ0EgYkF2ZW5pcjAeFw0yNDExMjgxMDAwMDBaFw0yNTExMjgxMDAwMDBaMHcx
FTATBgNVBAMMDG5vZGVfYkF2ZW5pcjETMBEGA1UECgwKY2x4MTIzYWJjMRcwFQYD
VQQLDg5JVCBEZXBhcnRtZW50MRYwFAYDVQQHDA1TYW4gRnJhbmNpc2NvMRMwEQYD
VQQIDApDYWxpZm9ybmlhMQswCQYDVQQGEwJVUzCCASIwDQYJKoZIhvcNAQEBBQAD
...
[Base64 encoded certificate data]
...
-----END CERTIFICATE-----
```

##### 6. Certificate Delivery to User

**Files:**
- `src/server/utils/nodeManager.ts` (Returns certificate in response)
- `src/server/api/master/node/index.post.ts` (Master endpoint)
- `src/server/api/realm/[realm]/node/index.post.ts` (Realm-specific endpoint)
- `src/components/realm/node/CreateDialog.vue` (Lines 154-168 - Download handler)

**API Response Structure:**

```typescript
interface NodeCreationResult {
  node: Node                        // Database record with id, name, host, etc.
  certificate: string               // PEM-encoded X.509 certificate
  privateKey: string                // PEM-encoded RSA private key
  kcClient: ClientRepresentation    // Keycloak client details
}
```

**Frontend Download Implementation (`CreateDialog.vue`):**

```typescript
const certificateData = ref<{
  certificate: string
  privateKey: string
  nodeName: string
} | null>(null)

const downloadCertificate = () => {
  if (!certificateData.value) return
  
  // Combine certificate and private key in a single PEM file
  const content = `${certificateData.value.certificate}\n${certificateData.value.privateKey}`
  
  // Create a Blob with MIME type for PEM files
  const blob = new Blob([content], { type: 'application/x-pem-file' })
  const url = URL.createObjectURL(blob)
  
  // Trigger download
  const link = document.createElement('a')
  link.href = url
  link.download = `${certificateData.value.nodeName}-certificate.pem`
  link.click()
  
  // Clean up
  URL.revokeObjectURL(url)
}

// After successful node creation
const response = await realmNodeStore.create(formData)
certificateData.value = {
  certificate: response.certificate,
  privateKey: response.privateKey,
  nodeName: response.node.name,
}
```

**Downloaded Certificate File Format (Combined PEM):**

The user receives a single `.pem` file containing both the certificate and private key:

```
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0k9F3mYxZMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkVVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm1lZGlh
[... certificate content ...]
gH3jKLMNOPQR==
-----END CERTIFICATE-----
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAw7QdF9jH3kL2mN5pO6qR7sT8uV9wX0yA1bC2dD3eE4fF5gG6
hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zA5zB0bC1c
[... private key content ...]
xYzABCDEFG==
-----END RSA PRIVATE KEY-----
```

**⚠️ CRITICAL SECURITY NOTE:**

The private key is **transmitted only once** in the API response and is **NEVER stored** in the database. Users must:
- Download and securely store the certificate file immediately
- Protect the file with restrictive permissions (e.g., `chmod 600`)
- If the private key is lost, certificate regeneration is required

#### How Nodes Use Certificates for Authentication

After registration, nodes use the client certificate to authenticate with Keycloak and obtain access tokens for API calls.

##### mTLS Token Acquisition Flow

The following diagram shows how a node authenticates using its certificate:

```mermaid
sequenceDiagram
    participant Node as Node Service
    participant KC as Keycloak
    participant API as API Endpoint
    
    Note over Node: Has certificate + private key<br/>from registration
    
    Node->>KC: POST /realms/{realm}/protocol/openid-connect/token<br/>--cert certificate.pem --key private.pem<br/>grant_type=client_credentials<br/>client_id=node_bAvenir
    
    Note over KC: 1. Verify certificate chain<br/>2. Extract CN from certificate<br/>3. Match CN against x509.subjectdn regex<br/>4. Check expiration & revocation
    
    alt Certificate Valid
        KC-->>Node: 200 OK<br/>{ access_token, expires_in, token_type }
        
        Node->>API: GET /api/some/endpoint<br/>Authorization: Bearer {access_token}
        
        API->>API: Verify JWT signature<br/>with Keycloak public key
        
        alt Token Valid
            API-->>Node: 200 OK<br/>{ data }
        else Token Invalid/Expired
            API-->>Node: 401 Unauthorized
        end
        
    else Certificate Invalid
        KC-->>Node: 401 Unauthorized<br/>{ error: "invalid_client" }
    end
```

##### Step 1: Obtain Access Token with Client Certificate

**Command-line example using curl:**

```bash
# Node service authenticates with Keycloak using mTLS
curl -X POST \
  https://auth.dev.circuless.bavenir.eu/realms/circuless/protocol/openid-connect/token \
  --cert /secure/location/bavenir-certificate.pem \
  --key /secure/location/bavenir-certificate.pem \
  -d "grant_type=client_credentials" \
  -d "client_id=node_bAvenir"
```

**Note:** Since the certificate file contains both the certificate and private key, the same file is used for both `--cert` and `--key` parameters.

**Keycloak's mTLS Validation Process:**

1. **Certificate Chain Verification** - Validates that the certificate is signed by a trusted CA (configured in Keycloak's truststore)
2. **CN Extraction** - Extracts the Common Name (CN) from the certificate's Subject DN
3. **Pattern Matching** - Compares CN against the client's `x509.subjectdn` regex pattern (`.*CN=node_bAvenir*`)
4. **Expiration Check** - Verifies the certificate is within its validity period
5. **Revocation Check** - Optionally checks Certificate Revocation Lists (CRL) or OCSP

**Successful Token Response:**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyMyJ9.eyJleHAiOjE3MzI4MDAwMDAsImlhdCI6MTczMjc5OTcwMCwianRpIjoiYWJjMTIzLWRlZjQ1NiIsImlzcyI6Imh0dHBzOi8vYXV0aC5kZXYuY2lyY3VsZXNzLmJhdmVuaXIuZXUvcmVhbG1zL2NpcmN1bGVzcyIsInN1YiI6InNlcnZpY2UtYWNjb3VudC1ub2RlLWJhdmVuaXIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJub2RlX2JBdmVuaXIiLCJhY3IiOiIxIiwic2NvcGUiOiJvcGVuaWQgZW1haWwifQ.signature",
  "token_type": "Bearer",
  "expires_in": 300,
  "scope": "openid email"
}
```

**Token Claims (JWT Payload):**

```json
{
  "exp": 1732800000,                    // Expiration timestamp
  "iat": 1732799700,                    // Issued at timestamp
  "jti": "abc123-def456",               // JWT ID (unique identifier)
  "iss": "https://auth.dev.circuless.bavenir.eu/realms/circuless",  // Issuer
  "sub": "service-account-node-bavenir",  // Subject (service account user ID)
  "typ": "Bearer",                       // Token type
  "azp": "node_bAvenir",                // Authorized party (client ID)
  "acr": "1",                           // Authentication Context Class Reference
  "scope": "openid email"               // Granted scopes
}
```

##### Step 2: Token Verification via Handshake Endpoint

The application provides a dedicated endpoint for nodes to verify their tokens:

**Endpoint:** `GET /api/node/handshake`  
**File:** `src/server/api/node/handshake.get.ts`

**Usage Example:**

```bash
# Node verifies its token
curl -X GET \
  http://localhost:3000/api/node/handshake \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Backend Implementation:**

```typescript
export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ headers }) => {
      // Extract access token from Authorization header
      const authHeader = getHeader(event, 'authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Missing or invalid Authorization header',
        })
      }
      
      const token = authHeader.substring(7)  // Remove "Bearer " prefix
      
      // Verify token against Keycloak public key
      const realm: Realm = Realm.circuless
      const claims = await keycloak.verifyToken(token, realm)
      
      return {
        success: true,
        message: 'Token verified successfully',
        claims,
        timestamp: new Date().toISOString(),
      }
    },
    {
      protected: false,  // No session required - uses token from header
    }
  )
})
```

**Token Verification Logic (`src/server/utils/keycloak.ts`, Lines 206-232):**

```typescript
import { jwtVerify, importSPKI } from 'jose'

export class KeycloakService {
  private publicKeys: Record<Realm, CryptoKey> = {}
  
  /**
   * Initialize and cache Keycloak public keys for each realm
   * Called on server startup
   */
  async initialize() {
    const realms = Object.values(Realm)
    
    for (const realm of realms) {
      // Fetch realm's public key from Keycloak
      const realmInfo = await $fetch<{ public_key: string }>(
        `${this.endpoint}/realms/${realm}`
      )
      
      // Convert PEM public key to CryptoKey for verification
      const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${realmInfo.public_key}\n-----END PUBLIC KEY-----`
      this.publicKeys[realm] = await importSPKI(publicKeyPem, 'RS256')
    }
  }
  
  /**
   * Verify a JWT access token using the realm's public key
   */
  async verifyToken(token: string, realm: Realm): Promise<ClaimsUnverified> {
    try {
      const publicKey = this.publicKeys[realm]
      
      if (!publicKey) {
        throw new Error(`Public key not loaded for realm: ${realm}`)
      }
      
      // Verify JWT signature and claims
      const { payload } = await jwtVerify(token, publicKey, {
        issuer: `${this.endpoint}/realms/${realm}`,  // Verify issuer
        clockTolerance: 10,  // Allow 10 seconds clock skew
      })
      
      return payload as ClaimsUnverified
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token',
      })
    }
  }
}
```

**Successful Verification Response:**

```json
{
  "success": true,
  "message": "Token verified successfully",
  "claims": {
    "exp": 1732800000,
    "iat": 1732799700,
    "jti": "abc123-def456",
    "iss": "https://auth.dev.circuless.bavenir.eu/realms/circuless",
    "sub": "service-account-node-bavenir",
    "typ": "Bearer",
    "azp": "node_bAvenir",
    "acr": "1",
    "scope": "openid email"
  },
  "timestamp": "2024-11-28T12:30:45.123Z"
}
```

#### Technical Specifications

##### Cryptographic Details

- **Algorithm:** RSA
- **Key Size:** 2048 bits
- **Signature Hash:** SHA-256
- **Certificate Format:** X.509 v3
- **Encoding:** PEM (Privacy Enhanced Mail - Base64 with headers)
- **Library:** `node-forge` NPM package for key generation and CSR creation
- **JWT Verification:** `jose` NPM package for token signature validation

##### Certificate Structure Example

```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 1234567890 (0x499602d2)
        Signature Algorithm: sha256WithRSAEncryption
        Issuer:
            CN = Circuless Intermediate CA
            O = bAvenir
            C = EU
        Validity
            Not Before: Nov 28 10:00:00 2024 GMT
            Not After : Nov 28 10:00:00 2025 GMT
        Subject:
            CN = node_bAvenir
            O = clx123abc
            OU = IT Department
            L = San Francisco
            ST = California
            C = US
            x500UniqueIdentifier = clx123abc-cly456def
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus: 00:c3:b4:1d:17...
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment
            X509v3 Extended Key Usage:
                TLS Web Client Authentication
    Signature Algorithm: sha256WithRSAEncryption
         a1:b2:c3:d4...
```

##### Environment Variables

**Required Configuration (`.env`):**

```bash
# PKI Service Configuration
NUXT_PKI_URL='https://pki.circuless.bavenir.eu'
NUXT_PKI_USER='cc'
NUXT_PKI_PASSWORD='your-secure-password'

# Keycloak Configuration
NUXT_PUBLIC_OIDC_ENDPOINT='https://auth.dev.circuless.bavenir.eu'
NUXT_PUBLIC_OIDC_REALMS='{
  "master": { "client_id": "admin", "realm": "master" },
  "circuless": { "client_id": "circuless", "realm": "circuless" }
}'
NUXT_OIDC_REALM_SECRETS='{
  "master": "master-client-secret",
  "circuless": "circuless-client-secret"
}'

# Database
DATABASE_URL='postgresql://user:password@localhost:5432/database?schema=public'
```

**Configuration Loading:**

- **Public config** (`NUXT_PUBLIC_*`): Available client-side and server-side
- **Private config** (`NUXT_*`): Server-side only (not exposed to browser)
- PKI and Keycloak utilities initialized in `src/server/utils/`

##### Keycloak Prerequisites

**Realm Configuration:**

1. **Create realm** (e.g., `circuless`)
2. **Enable X.509 authentication:**
   - Navigate to: Realm Settings → Client Authentication → X509 Certificate
   - Upload Root CA and Intermediate CA certificates to truststore
   - Configure certificate validation rules
3. **Enable Organizations feature** (Keycloak 23+)
   - Organizations → Enable Organizations

**Trusted CA Configuration:**

Keycloak must trust the PKI service's certificate chain. Upload the Root CA and Intermediate CA certificates to Keycloak's truststore:

```bash
# Import CA certificate into Keycloak truststore
keytool -import -alias pki-root-ca \
  -file root-ca.crt \
  -keystore /opt/keycloak/conf/truststore.jks \
  -storepass changeit
```

#### Key Implementation Files Reference

| File | Purpose | Key Functions |
|------|---------|---------------|
| `src/server/utils/nodeManager.ts` | Node orchestration and business logic | `create()`, `delete()`, `regenerateCertificate()`, `_generateCSR()`, `_cleanupFailedNodeCreation()` |
| `src/server/utils/keycloak.ts` | Keycloak API wrapper and authentication | `createClient()`, `getClientServiceAccount()`, `addUserToOrganisation()`, `deleteClient()`, `verifyToken()` |
| `src/server/utils/pki.ts` | PKI service integration | `signCertificateRequest()`, `verifyCertificate()`, `revokeCertificate()` |
| `prisma/models/node.prisma` | Database schema for Node model | Node model definition with relationships |
| `src/server/api/master/node/index.post.ts` | Master realm node creation endpoint | HTTP POST handler for admin node creation |
| `src/server/api/realm/[realm]/node/index.post.ts` | Dynamic realm node creation endpoint | HTTP POST handler for realm-specific node creation |
| `src/server/api/node/handshake.get.ts` | Token verification endpoint | JWT validation and claims extraction |
| `src/server/api/realm/[realm]/node/[nodeId]/regenerate.post.ts` | Certificate regeneration endpoint | Generate new certificate for existing node |
| `src/pages/master/node/create.vue` | Master realm node creation page | UI for creating nodes (admin view) |
| `src/components/master/node/CreateForm.vue` | Node creation form component | Form validation and submission |
| `src/components/realm/node/CreateDialog.vue` | Realm-specific node dialog | Node creation with certificate download |
| `src/stores/master/node.ts` | Master node state management (Pinia) | API calls and state for master realm nodes |
| `src/stores/realm/node.ts` | Realm node state management (Pinia) | API calls and state for realm-specific nodes |

#### Common Troubleshooting Scenarios

##### Issue 1: Certificate Validation Fails

**Error Message:**
```
Error: x509: certificate signed by unknown authority
```

**Cause:** Keycloak's truststore does not contain the PKI service's Root CA or Intermediate CA certificate.

**Solution:**
1. Obtain the Root CA and Intermediate CA certificates from the PKI service
2. Import them into Keycloak's truststore:
   ```bash
   keytool -import -alias pki-root-ca -file root-ca.crt \
     -keystore /opt/keycloak/conf/truststore.jks -storepass changeit
   keytool -import -alias pki-intermediate-ca -file intermediate-ca.crt \
     -keystore /opt/keycloak/conf/truststore.jks -storepass changeit
   ```
3. Restart Keycloak

##### Issue 2: CN Pattern Mismatch

**Error Message:**
```
Error: x509.subjectdn pattern does not match
```

**Cause:** The certificate's Common Name (CN) does not match the Keycloak client's `x509.subjectdn` regex pattern.

**Solution:**
1. Verify the CN in the certificate matches the client ID:
   ```bash
   openssl x509 -in certificate.pem -noout -subject
   # Should show: subject=CN=node_bAvenir,...
   ```
2. Check Keycloak client configuration:
   - Navigate to: Clients → node_bAvenir → Settings → Advanced → X509 Certificate
   - Verify `x509.subjectdn` is `.*CN=node_bAvenir*`
3. If mismatch, regenerate the certificate or update the Keycloak client configuration

##### Issue 3: Token Acquisition Fails

**Error Message:**
```json
{
  "error": "invalid_client",
  "error_description": "Client authentication failed"
}
```

**Possible Causes:**
1. **Certificate expired** - Check certificate validity period
2. **Private key mismatch** - Private key doesn't match the certificate
3. **Certificate revoked** - Certificate was revoked via PKI service
4. **Wrong client ID** - `client_id` parameter doesn't match certificate's CN

**Solution:**
```bash
# Check certificate expiration
openssl x509 -in certificate.pem -noout -dates
# Output: notBefore=..., notAfter=...

# Verify private key matches certificate
openssl x509 -in certificate.pem -noout -modulus | md5sum
openssl rsa -in certificate.pem -noout -modulus | md5sum
# Both MD5 hashes should match

# If expired or compromised, regenerate certificate
curl -X POST http://localhost:3000/api/realm/circuless/node/{nodeId}/regenerate \
  -H "Authorization: Bearer {admin-token}"
```

##### Issue 4: PKI Service Rejects CSR

**Error Message:**
```
Error: x500UniqueIdentifier does not match cert_id
```

**Cause:** The CSR's `x500UniqueIdentifier` field doesn't match the expected format `{organisationId}-{nodeId}`.

**Solution:**
1. Verify the certificate ID construction in `nodeManager.ts`:
   ```typescript
   const certId = `${node.owner?.id || 'system'}-${node.id}`
   ```
2. Check that the PKI service endpoint URL uses the same ID:
   ```typescript
   POST /pki/certificates/{certId}  // Must match x500UniqueIdentifier
   ```
3. Enable debug logging to inspect the generated CSR:
   ```typescript
   console.log('Certificate ID:', certId)
   console.log('CSR:', csr.substring(0, 200))
   ```

---

### Master Token Pattern for Admin Operations

This application implements a non-obvious authentication pattern where **client realm users** (e.g., users authenticated in the `circuless` realm) can perform administrative Keycloak operations—such as inviting users to organizations, creating Keycloak clients for nodes, or updating organization details—despite not having direct admin permissions in their own realm.

#### The Problem

**Keycloak's RBAC Model Limitation:**

- Keycloak admin APIs (e.g., `/admin/realms/{realm}/organizations/{id}/members/invite-user`, `/admin/realms/{realm}/clients`) require specific admin roles to execute
- Client realm users (authenticated in `circuless`, `mynewproject`, etc.) typically don't have admin permissions to manage resources even within their own realm
- Keycloak's Role-Based Access Control (RBAC) doesn't easily allow organization admins to perform admin operations on their realm without escalated privileges

**Real-World Scenario:**

An organization admin in the `circuless` realm wants to invite a new user to their organization. This requires calling Keycloak's admin API to create an invitation. However, the organization admin's access token from the `circuless` realm lacks the necessary `manage-users` or `manage-realm` roles to execute this operation.

#### The Solution: Master Token Pattern

The application uses a **workaround pattern** where the server obtains a **master realm service account token** and uses it to perform admin operations on behalf of the user.

**Key Components:**

1. **Master Realm Client** - A special Keycloak client in the `master` realm (typically configured as `admin`) with:
   - Service account enabled
   - Admin roles granted to its service account that allow cross-realm management
   
2. **OAuth 2.0 Client Credentials Grant** - The server authenticates as this master client using client credentials to obtain a service account token

3. **Token Substitution** - Instead of using the user's realm token for admin API calls, the server uses the master token

4. **Authorization Still Enforced** - Even though a master token is used, the API endpoint validates that the user has permission to perform the operation (e.g., user belongs to the organization they're managing)

**From the codebase** (`src/server/utils/keycloak.ts` line 39):
```typescript
// This is a workaround for the Keycloak API, which requires a token from the master realm 
// until RBAC allows organisation management
```

This indicates the pattern is temporary until Keycloak's RBAC system can be configured to allow organization management directly by client realm users.

#### Complete Flow Diagram

The following diagram illustrates how a client realm user performs an admin operation:

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant API as API Endpoint
    participant Manager as Business Logic
    participant KC_Utils as keycloak.getMasterToken()
    participant KC_Master as Keycloak<br/>(master realm)
    participant KC_Admin as Keycloak Admin API<br/>(/admin/realms/circuless/...)
    
    User->>Browser: Click "Invite User" in circuless realm
    Browser->>API: POST /api/realm/circuless/user/invite<br/>Cookie: circuless_session_id<br/>Body: {email, givenName, familyName}
    
    Note over API: Middleware validates<br/>circuless realm session
    
    API->>API: Extract user from session<br/>Validate user.realm === 'circuless'<br/>Validate user has organization
    
    API->>Manager: userManager.invite(event, data)
    
    Note over Manager: User's circuless token<br/>lacks admin permissions
    
    Manager->>KC_Utils: getMasterToken(event)
    
    KC_Utils->>KC_Master: POST /realms/master/protocol/openid-connect/token<br/>grant_type=client_credentials<br/>client_id=admin<br/>client_secret=***
    
    Note over KC_Master: Authenticate service account<br/>for 'admin' client
    
    KC_Master-->>KC_Utils: { access_token: "master_token...", expires_in: 300 }
    
    KC_Utils-->>Manager: { access_token: "master_token..." }
    
    Manager->>KC_Admin: POST /admin/realms/circuless/organizations/{id}/members/invite-user<br/>Authorization: Bearer master_token<br/>Body: {email, firstName, lastName}
    
    Note over KC_Admin: Validate master token has<br/>manage-users role for circuless realm
    
    KC_Admin->>KC_Admin: Create invitation<br/>Send email to user
    
    KC_Admin-->>Manager: 200 OK
    
    Manager-->>API: User invitation sent
    
    API-->>Browser: 200 OK<br/>{message: "User invitation sent"}
    
    Browser->>User: Show success message
```

#### Master Token Acquisition

##### getMasterToken() Implementation

**File:** `src/server/utils/keycloak.ts` (Lines 854-876)

```typescript
/**
 * Obtain a master realm service account token using client credentials grant
 * This token has admin permissions to manage all realms
 */
async getMasterToken(event: H3Event<EventHandlerRequest>) {
    const endpoint = config.public.OIDC.ENDPOINT;  // Keycloak base URL
    const { client_id } = this.realms.master;       // "admin" from config
    const client_secret = this.realmSecrets.master; // Master client secret from env

    return await keycloakApiWrapper(async () => {
        const url = `${endpoint}/realms/master/protocol/openid-connect/token`;
        
        // OAuth 2.0 Client Credentials Grant
        const data = new URLSearchParams({
            grant_type: "client_credentials",  // Service account flow
            client_id,                         // Master client ID
            client_secret,                     // Master client secret (server-side only)
        });

        return await $fetch<TokenResponse>(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: data,
        });
    });
}
```

**Key Characteristics:**

- **Grant Type:** `client_credentials` - OAuth 2.0 service account authentication
- **No User Context:** This token represents the application itself, not any specific user
- **Short-lived:** Typically expires in 300 seconds (5 minutes)
- **Not Cached:** Obtained fresh for each operation that needs it
- **Server-side Only:** Never exposed to the browser or client-side code

**Token Response:**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "token_type": "Bearer",
  "scope": "email profile"
}
```

##### Environment Configuration

**Required Environment Variables (`.env`):**

```bash
# Keycloak Configuration
NUXT_PUBLIC_OIDC_ENDPOINT='https://auth.dev.circuless.bavenir.eu'

# Public realm configuration (client-side visible)
NUXT_PUBLIC_OIDC_REALMS='{
   "master":{
      "client_id":"admin",      
      "realm":"master"
   },
   "circuless":{
      "client_id":"circuless",
      "realm":"circuless"
   }
}'

# Server-side secrets (NEVER expose to client, NEVER commit to git)
NUXT_OIDC_REALM_SECRETS='{
   "master":"your-master-client-secret-here",
   "circuless":"your-circuless-client-secret-here"
}'
```

**Security Note:** The `NUXT_OIDC_REALM_SECRETS` variable contains sensitive credentials. It must:
- Never be committed to version control
- Only be accessible server-side (not exposed to browser)
- Be stored securely in production (e.g., using secret management services)

**Configuration Loading** (`nuxt.config.ts` Lines 82-95):

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    // Server-side only configuration
    OIDC: {
      REALM_SECRETS: JSON.parse(
        process.env.NUXT_OIDC_REALM_SECRETS ?? "{}"
      ) as RealmSecrets,
    },
    public: {
      // Available on both client and server
      OIDC: {
        ENDPOINT: process.env.NUXT_PUBLIC_OIDC_ENDPOINT ?? "",
        REALMS: JSON.parse(
          process.env.NUXT_PUBLIC_OIDC_REALMS ?? "{}"
        ) as Realms,
      },
    },
  },
})
```

##### Keycloak Master Client Configuration

**Prerequisites in Keycloak:**

1. **Create Client in Master Realm:**
   - Navigate to: Master Realm → Clients → Create Client
   - **Client ID:** `admin` (or as configured in `NUXT_PUBLIC_OIDC_REALMS`)
   - **Client Protocol:** openid-connect
   - **Client Authentication:** ON (confidential client)
   - **Service Accounts Enabled:** ON (critical!)
   - **Standard Flow:** Optional (for admin UI login)
   - **Direct Access Grants:** Optional
   - **Valid Redirect URIs:** `${NUXT_PUBLIC_APP_URL}/api/master/auth/loginCallback`

2. **Configure Service Account Roles:**
   
   The service account user (automatically created when service accounts are enabled) needs admin roles for each client realm it will manage.
   
   **Steps:**
   - Navigate to: Clients → admin → Service Account Roles
   - Click "Assign role"
   - Filter by clients
   - For each client realm (e.g., `circuless-realm` client):
     - Assign: `manage-realm` (full realm administration)
     - Assign: `manage-users` (create, invite, delete users)
     - Assign: `manage-clients` (create, delete clients)
     - Assign: `view-users` (list users)
     - Assign: `query-users` (search users)
     - Assign: `view-clients` (list clients)
   
   **Alternative - Broader Permissions:**
   - Assign `realm-admin` role for the target realm (grants all permissions)

3. **Generate Client Secret:**
   - Navigate to: Clients → admin → Credentials
   - Copy the **Client Secret** value
   - Store in `NUXT_OIDC_REALM_SECRETS` environment variable

**Verification:**

```bash
# Test master token acquisition manually
curl -X POST \
  https://auth.dev.circuless.bavenir.eu/realms/master/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=admin" \
  -d "client_secret=your-master-secret"

# Should return:
# {
#   "access_token": "eyJhbGci...",
#   "expires_in": 300,
#   "token_type": "Bearer"
# }
```

#### Operations Using Master Tokens

The application uses the master token pattern for various admin operations. All follow the same general pattern:

```typescript
// Step 1: Obtain master token
const { access_token } = await keycloak.getMasterToken(event)

// Step 2: Call Keycloak admin API with master token
await keycloak.[adminMethod](event, ..., realm, access_token)
```

##### Example 1: User Invitation to Organization

**Business Logic** (`src/server/utils/userManager.ts` Lines 30-47):

```typescript
invite = async (
    event: H3Event<EventHandlerRequest>,
    data: userTypes.InviteData
) => {
    // Prepare invitation data
    const invite: InviteRepresentation = {
        email: data.email,
        firstName: data.givenName,
        lastName: data.familyName,
    }
    
    // CRITICAL: Obtain master token instead of using user's token
    // User's circuless token lacks manage-users permission
    const { access_token } = await keycloak.getMasterToken(event)
    
    // Call Keycloak admin API with master token
    await keycloak.inviteUserToOrganisation(
        event,
        invite,
        data.kcOrganisationId,  // Organization ID in Keycloak
        data.realm,              // 'circuless' (target realm)
        access_token             // Master token (not user's token!)
    )
}
```

**Keycloak API Call** (`src/server/utils/keycloak.ts` Lines 621-655):

```typescript
async inviteUserToOrganisation(
    event: H3Event<EventHandlerRequest>,
    invite: InviteRepresentation,
    kcOrganisationId: string,
    realm: Realm,
    accessToken?: string  // Optional: use provided token or fall back to user's token
) {
    const endpoint = config.public.OIDC.ENDPOINT;
    
    // Security: Prevent invitations to master realm
    if (realm === "master") {
        throw new ApplicationError(
            "Cannot register user in master realm",
            HttpStatusCode.BAD_REQUEST
        );
    }

    await keycloakApiWrapper(async () => {
        const url = `${endpoint}/admin/realms/${realm}/organizations/${kcOrganisationId}/members/invite-user`;
        
        // Use provided token (master token) or fall back to user's session token
        const access_token = accessToken ?? event.context.tokens?.access_token;

        const data = new URLSearchParams({
            email: invite.email,
            firstName: invite.firstName || "",
            lastName: invite.lastName || "",
        });

        await $fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,  // Master token used here
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: data,
        });
    });
}
```

**API Endpoints:**
- **Client Realm:** `POST /api/realm/circuless/user/invite` → `src/server/api/realm/[realm]/user/invite.post.ts`
- **Master Realm:** `POST /api/master/user/invite` → `src/server/api/master/user/invite.post.ts`

Both endpoints validate the user's session/permissions, then call `userManager.invite()` which obtains the master token.

##### Example 2: Organization Update

**Business Logic** (`src/server/utils/organisationManager.ts` Lines 74-88):

```typescript
update = async <T extends Prisma.OrganisationDefaultArgs>(
    event: H3Event<EventHandlerRequest>,
    organisationId: string,
    data: organisationTypes.UpdateBodyMaster,
    args?: T
) => {
    // Fetch existing organization
    const organisation = await db.organisation.queries.get(
        organisationId, 
        db.organisation.args.all
    )
    const name = data.name ?? organisation.name

    // Obtain master token for admin API access
    const { access_token } = await keycloak.getMasterToken(event)
    
    // Fetch current organization state from Keycloak
    const kcOrganisation: OrganisationRepresentation = {
        ...(await keycloak.getOrganisationById(
            event, 
            organisation.kcId, 
            organisation.realm, 
            access_token
        )),
        name,
    }
    
    // Update in Keycloak using master token
    await keycloak.updateOrganisation(
        event, 
        kcOrganisation.id!, 
        kcOrganisation, 
        organisation.realm, 
        access_token
    )
    
    // Sync to database
    return await db.organisation.queries.upsert(
        kcOrganisation.id!, 
        organisation.realm, 
        kcOrganisation, 
        args ?? db.organisation.args.all
    ) as unknown as Prisma.OrganisationGetPayload<T>
}
```

**Operations requiring master token:**
1. `getOrganisationById()` - Fetch organization details from Keycloak
2. `updateOrganisation()` - Update organization in Keycloak

##### Example 3: Node Registration (Keycloak Client Creation)

**Business Logic** (`src/server/utils/nodeManager.ts` Lines 23-65):

```typescript
create = async (
    event: H3Event<EventHandlerRequest>, 
    data: nodeTypes.CreateBody
): Promise<NodeCreationResult> => {
    const cleanup: NodeCreationCleanup = {}

    try {
        // Prepare Keycloak client configuration for X.509 auth
        const clientId = `node_${data.name}`
        const kcClientData: ClientRepresentation = {
            clientId,
            name: `Node Client: ${data.name}`,
            enabled: true,
            publicClient: false,
            serviceAccountsEnabled: true,
            clientAuthenticatorType: 'client-x509',
            attributes: {
                'x509.subjectdn': `.*CN=${clientId}*`,
                'x509.allow.regex.pattern.comparison': 'true',
            },
            protocol: 'openid-connect',
        }

        // STEP 1: Obtain master token
        const { access_token } = await keycloak.getMasterToken(event)

        // STEP 2: Create Keycloak client in target realm
        const kcClient = await keycloak.createClient(
            event, 
            kcClientData, 
            data.realm,      // 'circuless'
            access_token     // Master token
        )
        cleanup.kcClientId = kcClient.id!

        // STEP 3: Get service account user for the client
        const clientServiceAccount = await keycloak.getClientServiceAccount(
            event, 
            kcClient.id!, 
            data.realm, 
            access_token     // Master token
        )

        // STEP 4: Add service account to organization
        const organisation = await db.organisation.queries.get(data.ownerId)
        await keycloak.addUserToOrganisation(
            event, 
            clientServiceAccount.id, 
            organisation.kcId, 
            data.realm, 
            access_token     // Master token
        )

        // STEP 5: Create database record
        const node = await db.node.queries.create({
            name: data.name,
            host: data.host,
            realm: data.realm,
            roles: data.roles,
            access: data.access,
            ownerId: data.ownerId,
            status: 'pending',
        })
        cleanup.nodeId = node.id

        // STEP 6: Generate certificate (covered in previous section)
        // ...
        
    } catch (error) {
        await _cleanupFailedNodeCreation(event, cleanup, data.realm)
        throw error
    }
}
```

**Operations requiring master token:**
1. `createClient()` - Create Keycloak client
2. `getClientServiceAccount()` - Retrieve service account user
3. `addUserToOrganisation()` - Add service account to organization

##### Example 4: Node Deletion (Keycloak Client Cleanup)

**Business Logic** (`src/server/utils/nodeManager.ts` Lines 91-108):

```typescript
delete = async (
    event: H3Event<EventHandlerRequest>, 
    nodeId: string, 
    userId: string
) => {
    const user = await db.user.queries.get(userId, db.user.args.all)
    const node = await db.node.queries.getUserRealm(
        nodeId, 
        userId, 
        user.realm, 
        db.node.args.all
    )

    // Attempt to delete associated Keycloak client
    try {
        const { access_token } = await keycloak.getMasterToken(event)
        
        // Find the client by client ID pattern
        const clients = await keycloak.getClients(event, node.realm, access_token)
        const kcClient = clients.find(
            (client) => client.clientId === `node_${node.name}`
        )

        if (kcClient && kcClient.id) {
            await keycloak.deleteClient(event, kcClient.id, node.realm, access_token)
        }
    } catch (error) {
        console.error(`Failed to delete KC client for node ${node.name}:`, error)
        // Continue with database deletion even if Keycloak cleanup fails
    }

    // Delete node from database (Prisma handles cascade deletes)
    return await db.node.queries.delete(nodeId, db.node.args.all)
}
```

**Operations requiring master token:**
1. `getClients()` - List clients in realm
2. `deleteClient()` - Delete Keycloak client

#### Optional accessToken Parameter Pattern

Most Keycloak utility methods follow a flexible pattern with an **optional `accessToken` parameter**:

```typescript
async createClient(
    event: H3Event<EventHandlerRequest>,
    client: ClientRepresentation,
    realm: Realm,
    accessToken?: string  // Optional!
) {
    const endpoint = config.public.OIDC.ENDPOINT;

    return await keycloakApiWrapper(async () => {
        const url = `${endpoint}/admin/realms/${realm}/clients`;
        
        // Use provided token if available, otherwise fall back to user's session token
        const access_token = accessToken ?? event.context.tokens?.access_token;
        
        return await $fetch<ClientRepresentation>(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: client,
        });
    });
}
```

**This pattern enables:**

1. **Default Behavior:** Use the user's token from their session (`event.context.tokens?.access_token`)
   ```typescript
   await keycloak.createClient(event, clientData, realm)
   // Uses user's token (if they have sufficient permissions)
   ```

2. **Override Behavior:** Explicitly pass a master token when needed
   ```typescript
   const { access_token } = await keycloak.getMasterToken(event)
   await keycloak.createClient(event, clientData, realm, access_token)
   // Uses master token for admin operations
   ```

3. **Flexibility:** Same method can serve both admin operations and user-permissioned operations

**Methods using this pattern:**
- `createClient()`
- `deleteClient()`
- `getClients()`
- `inviteUserToOrganisation()`
- `addUserToOrganisation()`
- `getOrganisationById()`
- `updateOrganisation()`
- `getClientServiceAccount()`
- And many more in `src/server/utils/keycloak.ts`

#### Master Token vs User Token Comparison

| Aspect | User Token | Master Token |
|--------|-----------|--------------|
| **Grant Type** | `authorization_code` (user login) | `client_credentials` (service account) |
| **Obtained By** | OAuth authorization code flow → login callback | Direct API call to `/realms/master/protocol/openid-connect/token` |
| **Represents** | Specific user in their realm | The application itself (service account) |
| **Stored In** | Session (realm-prefixed cookies: `circuless_session_id`) | Not stored (obtained per-request, short-lived) |
| **Lifespan** | Configurable (typically hours) with refresh | 300 seconds (5 minutes), no refresh |
| **Used For** | Reading user's own data, normal app operations | Admin operations (create users, clients, organizations) |
| **Permissions** | User's assigned roles in their realm | Service account roles (cross-realm admin) |
| **Token Scope** | Single realm (user can only access their realm) | Can operate on any realm (if roles permit) |
| **Security Context** | User-specific, tied to user session | Application-level, no user context |
| **Example Operations** | Fetch my profile, list my organization's nodes | Invite user to organization, create Keycloak client |
| **Refresh Token** | Yes (stored in session) | No (obtain new token for each operation) |
| **Exposed to Client** | Indirectly via session cookie | Never (server-side only) |

**Example Token Claims:**

**User Token (circuless realm):**
```json
{
  "exp": 1732800000,
  "iat": 1732796400,
  "sub": "user-uuid-123",
  "email": "john.doe@example.com",
  "realm_access": {
    "roles": ["organization-admin"]
  },
  "azp": "circuless",
  "iss": "https://auth.dev.circuless.bavenir.eu/realms/circuless"
}
```

**Master Token (master realm service account):**
```json
{
  "exp": 1732800000,
  "iat": 1732799700,
  "sub": "service-account-admin",
  "clientId": "admin",
  "realm_access": {
    "roles": ["admin"]
  },
  "resource_access": {
    "circuless-realm": {
      "roles": ["manage-realm", "manage-users", "manage-clients"]
    },
    "realm-management": {
      "roles": ["manage-realm", "manage-users"]
    }
  },
  "azp": "admin",
  "iss": "https://auth.dev.circuless.bavenir.eu/realms/master"
}
```

Notice the master token has `resource_access` roles for the `circuless-realm` client, granting cross-realm admin permissions.

#### Security Considerations

Despite using a powerful master token, the application maintains security through multiple layers:

##### 1. Server-Side Only Token Acquisition

**Critical Security Point:** The master token is **never exposed to the client**.

```typescript
// getMasterToken() can ONLY be called from server-side code
// Client-side code cannot access this function or the master client secret

// ✅ SAFE: Server-side API endpoint
export default defineEventHandler(async (event) => {
    const { access_token } = await keycloak.getMasterToken(event)
    // Master token stays on server
})

// ❌ IMPOSSIBLE: Client-side code
// Cannot import or call getMasterToken() from browser
```

**Protection mechanisms:**
- `NUXT_OIDC_REALM_SECRETS` is runtime config (server-side only)
- Master client secret never sent to browser
- `getMasterToken()` only exists in server utilities

##### 2. Authorization Still Enforced at API Endpoints

Even though the master token is used for Keycloak API calls, **user authorization is validated at the application API layer**.

**Example from** `src/server/api/realm/[realm]/user/invite.post.ts`:

```typescript
export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ user, body, params }) => {
            const data = body as userTypes.InviteBodyRealm
            const realm = params!.realm as Realm
            
            // AUTHORIZATION CHECKS (before obtaining master token):
            
            // 1. User must have an organization
            if (!user?.organisation) {
                throw new ApplicationError(
                    'User has no organisation', 
                    HttpStatusCode.FORBIDDEN
                )
            }
            
            // 2. User must belong to the target realm
            if (user.organisation.realm !== realm) {
                throw new ApplicationError(
                    'User does not belong to this realm', 
                    HttpStatusCode.FORBIDDEN
                )
            }
            
            // 3. User must be authenticated (enforced by middleware)
            // 4. User must have organization-admin role (could be added)
            
            // ONLY AFTER validation: perform admin operation with master token
            await userManager.invite(event, { ...data, realm })
            
            return 'User invitation sent'
        },
        {
            schemas: {
                params: miscTypes.ClientRealmsParamSchema,
                body: userTypes.InviteBodyRealmSchema,
            },
            protected: true,  // Requires valid user session
        }
    )
})
```

**Security Layers:**
1. **Session validation** - User must have active session (`protected: true`)
2. **Realm validation** - User can only operate on their own realm
3. **Organization validation** - User must belong to an organization
4. **Resource ownership** - User can only manage their organization's resources

##### 3. Realm Validation in Keycloak Utilities

Most Keycloak utility methods include **explicit realm validation** to prevent operations on the master realm:

```typescript
async inviteUserToOrganisation(
    event: H3Event<EventHandlerRequest>,
    invite: InviteRepresentation,
    kcOrganisationId: string,
    realm: Realm,
    accessToken?: string
) {
    // CRITICAL: Prevent master realm operations
    if (realm === "master") {
        throw new ApplicationError(
            "Cannot register user in master realm",
            HttpStatusCode.BAD_REQUEST
        );
    }
    
    // Proceed with client realm operation
    // ...
}
```

This prevents client realm users from accidentally or maliciously performing operations on the master realm.

##### 4. No Refresh Token Storage

**Security by Design:**

- Master tokens are **obtained fresh** for each operation
- **No refresh tokens** are stored for the service account
- Tokens **expire quickly** (300 seconds)
- If compromised, the token is only valid for 5 minutes
- No persistent credentials beyond the initial client secret

##### 5. Token Isolation Model

**User tokens and master tokens are completely isolated:**

```typescript
// User's session tokens (stored per realm)
event.context.tokens = {
    access_token: "user's circuless token",
    refresh_token: "user's refresh token",
    id_token: "user's ID token",
}

// Master token (obtained dynamically, not stored)
const { access_token } = await keycloak.getMasterToken(event)
// This token is used immediately and discarded
```

**Isolation benefits:**
- User tokens cannot be used for admin operations (lack permissions)
- Master tokens are never associated with user sessions
- Each realm has separate session storage
- No token mixing or confusion

##### 6. Audit Trail

**All operations are traceable:**

```typescript
// User's identity is known from session
const user = event.context.user  // { id, email, organisation, ... }

// Master token is used for operation
const { access_token } = await keycloak.getMasterToken(event)
await keycloak.inviteUserToOrganisation(event, invite, orgId, realm, access_token)

// Logging can track: who (user.email) performed what (invite) on which (orgId) when
console.log(`User ${user.email} invited ${invite.email} to org ${orgId}`)
```

Even though the master token lacks user context, the application tracks the requesting user for audit purposes.

#### Key Implementation Files Reference

| File | Purpose | Key Functions/Endpoints |
|------|---------|------------------------|
| `src/server/utils/keycloak.ts` | Keycloak API wrapper with master token acquisition | `getMasterToken()`, `inviteUserToOrganisation()`, `createClient()`, `updateOrganisation()` |
| `src/server/utils/userManager.ts` | User management business logic | `invite()` - Uses master token for user invitations |
| `src/server/utils/organisationManager.ts` | Organization management business logic | `update()` - Uses master token for organization updates |
| `src/server/utils/nodeManager.ts` | Node management business logic | `create()`, `delete()` - Use master token for client creation/deletion |
| `src/server/api/realm/[realm]/user/invite.post.ts` | User invitation endpoint (client realms) | Validates user session, calls `userManager.invite()` |
| `src/server/api/master/user/invite.post.ts` | User invitation endpoint (master realm) | Master realm user invitation |
| `src/server/api/realm/[realm]/node/index.post.ts` | Node creation endpoint (client realms) | Validates user, calls `nodeManager.create()` |
| `src/server/api/master/node/index.post.ts` | Node creation endpoint (master realm) | Master realm node creation |
| `nuxt.config.ts` | Runtime configuration loading | Loads `NUXT_OIDC_REALM_SECRETS` (server-side only) |
| `.env.example` | Environment variable template | Shows structure of `NUXT_OIDC_REALM_SECRETS` |

#### Future Migration Path

**Current State:** This master token pattern is a **workaround** (as noted in code comments).

**Long-term Goal:** Configure Keycloak's RBAC to allow organization admins to perform admin operations directly within their realm using their own tokens.

**Potential Future Implementation:**

1. **Organization-Scoped Roles:**
   - Create custom roles in client realms: `organization-admin`, `organization-user-manager`
   - Grant these roles permissions to manage users/resources within their organization only

2. **Keycloak Authorization Services:**
   - Use Keycloak's fine-grained authorization to define policies
   - Policy example: "User with `organization-admin` role can invite users to their organization"

3. **Resource-Based Permissions:**
   - Each organization becomes a protected resource
   - Permissions tied to organization membership

**When migration happens:**
- Remove `getMasterToken()` calls from business logic
- Use `event.context.tokens?.access_token` (user's token) directly
- Keycloak will validate user has permission via their realm roles
- No code changes needed in API endpoints (same validation logic)

**Migration would simplify:**
- No need for master client secret management
- Reduced token acquisition overhead
- Better alignment with Keycloak's native RBAC model
- Clearer audit trail (operations use actual user tokens)

**Until then:** The master token pattern provides a pragmatic solution that works across all Keycloak versions and configurations.

---

## Who do I talk to?

Developed by bAvenir:
* Matej Kokol - [matej.kokol@bavenir.eu](mailto:matej.kokol@bavenir.eu)
* Jorge Almela - [jorge.almela@bavenir.eu](mailto:jorge.almela@bavenir.eu)
* Peter Drahovsky - [peter.drahovsky@bavenir.eu](mailto:peter.drahovsky@bavenir.eu)

## License

Copyright (C) 2024 bAvenir

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
