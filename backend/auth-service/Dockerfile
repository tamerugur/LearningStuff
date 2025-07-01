# ───────── Build Stage ─────────
FROM node:18-bullseye-slim AS builder
WORKDIR /app

# build-time deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends libssl1.1 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# install & generate client
COPY package*.json ./
COPY .npmrc ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate

# compile
COPY . .
RUN npm run build

# ───────── Production Stage ─────────
FROM node:18-bullseye-slim
WORKDIR /app

# runtime deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends libssl1.1 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# copy everything we need
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4001

# At container start, push your schema and then start the app
CMD ["sh", "-c", "npx prisma db push && exec node dist/index.js"]
