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
CMD node dist/index.js --http ${PORT:-3000} --enable-dynamic-registration --org-mode \
  --enabled-tools '^(list-mail-messages|list-mail-folders|list-mail-folder-messages|get-mail-message|send-mail|create-reply-draft|create-reply-all-draft|create-draft-email|create-forward-draft|send-draft-message|list-mail-attachments|get-mail-attachment|move-mail-message|update-mail-message|list-calendar-events|get-calendar-event|create-calendar-event|search-query|create-planner-task|get-planner-task|list-planner-tasks|update-planner-task|get-planner-task-details|update-planner-task-details|get-planner-plan|list-plan-tasks|list-planner-buckets|get-current-user)$'
