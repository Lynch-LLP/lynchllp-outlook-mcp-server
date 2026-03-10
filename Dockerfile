FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .
RUN npm run generate
RUN npm run build

FROM node:20-alpine AS release

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production
RUN npm i --ignore-scripts --omit=dev

# Use shell form so ${PORT:-3000} is expanded at runtime
# --org-mode enables Planner tools (workScopes: Tasks.Read/ReadWrite) and includes
# Planner scopes in OAuth discovery so tokens include the necessary permissions.
CMD node dist/index.js --http ${PORT:-3000} --enable-dynamic-registration --org-mode
