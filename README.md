# Circuless Collaboration Catalogue

Circuless Collaboration Catalogue is a Nuxt 3 application with Nitro OpenAPI integration and Joi schema validation. It provides a comprehensive platform for managing collaboration catalogues in the Circuless ecosystem, enabling users to register nodes, manage partnerships, and handle organization data with Prisma ORM and PostgreSQL.

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

## Contributing

ToDo

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
