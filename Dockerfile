FROM node:20-alpine AS builder
WORKDIR /app
COPY app/package*.json .
RUN npm install --production && npm cache clean --force
COPY app /app

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["sh", "-c", "npm run db:migrate && npm run start"]