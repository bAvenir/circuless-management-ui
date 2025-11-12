# Circuless Collaboration Catalogue

Nuxt 3 application with Nitro OpenAPI integration and Joi schema validation.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
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

**Note:** Due to Nitro macro limitations, schemas must be manually copied - dynamic variabes don't work in `defineRouteMeta`. GitHub issue: https://github.com/nitrojs/nitro/issues/2974

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run generate:schemas` - Generate OpenAPI schemas from Joi

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
