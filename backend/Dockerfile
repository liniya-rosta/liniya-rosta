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

COPY . .

COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# 3) runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 10001 -S app \
 && adduser -u 10001 -S -G app app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

RUN mkdir -p /app/public/{posts,products,portfolio} \
 && chown -R 10001:10001 /app

USER 10001:10001

EXPOSE 8000
CMD ["node", "dist/index.js"]