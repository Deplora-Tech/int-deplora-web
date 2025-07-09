FROM node:lts-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the files
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:lts-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from build stage
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port
EXPOSE 3000

# Set healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Run the application
CMD ["npm", "start"]