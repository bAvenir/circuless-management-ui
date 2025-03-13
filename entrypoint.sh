#!/bin/sh

# Generate the Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Seed the database
echo "Seeding the database..."
npx prisma db seed

# Start the Node.js server
echo "Starting Node.js server..."
exec node .output/server/index.mjs
