FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps ./apps

RUN npm install -g pnpm

RUN pnpm install --filter ./apps/api...

WORKDIR /app/apps/api

EXPOSE 5000

CMD ["pnpm", "dev"]
