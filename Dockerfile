FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/api

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/server.js"]
