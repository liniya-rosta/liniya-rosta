# 1) deps
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ libc6-compat
COPY package*.json ./
RUN npm ci

# 2) builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./

COPY src ./src
COPY public ./public
COPY index.ts ./index.ts
COPY config.ts ./config.ts
COPY translateYandex.ts ./translateYandex.ts
COPY types.d.ts ./types.d.ts
COPY fixtures.ts ./fixtures.ts

COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# 3) runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app
EXPOSE 8000
CMD ["node", "dist/index.js"]