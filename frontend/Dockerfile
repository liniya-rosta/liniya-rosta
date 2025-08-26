# 1)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2)
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# если код поменяется,а сборка - нет, то докер возьмет из кэша зависимостиы которые скопировал
COPY --from=deps /app/node_modules ./node_modules

# копируем весь проект в контейнер
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_IMG_SERVER

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_IMG_SERVER=$NEXT_PUBLIC_IMG_SERVER

RUN npm run build

# 3)
FROM node:22-alpine AS runner
WORKDIR /app

# чтобы Next работал в режиме продакшена для оптимизации кода
ENV NODE_ENV=production

# отлкючил "анонимную" статистику от vercel
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# запускаем не от root, а от встроенного пользователя node
USER node


#  копируем собранное приложение
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]