FROM node:23-slim AS base
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
RUN apt update && apt install --yes openssl
USER node
COPY --chown=node:node package*.json tsconfig.json ./
RUN npm ci && npm cache clean --force

FROM base AS build
ARG BUILD_DATE
LABEL version="1.0"
LABEL release-date=$BUILD_DATE
COPY --chown=node:node .output ./.output
COPY --chown=node:node prisma ./prisma
# Copy the entrypoint script into the container
COPY --chown=node:node entrypoint.sh ./entrypoint.sh
# Make the entrypoint script executable
RUN chmod +x ./entrypoint.sh
# Node JS port
EXPOSE 3000
# Set the entrypoint to run the script
ENTRYPOINT ["./entrypoint.sh"]