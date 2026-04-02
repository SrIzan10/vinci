FROM oven/bun:alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build the application
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun prisma generate
RUN bun run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install system dependencies
RUN apk add --no-cache ffmpeg fontconfig ttf-opensans msttcorefonts-installer && \
    update-ms-fonts && \
    fc-cache -f

RUN mkdir -p ./src/utils/db && \
    wget -O ./src/utils/db/dict.db https://github.com/SrIzan10/vinci/releases/download/dict-1/dict.db

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/assets ./assets
COPY --from=build /app/images ./images
COPY --from=build /app/.sern ./.sern
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

CMD ["sh", "-c", "bun run db:migrate && bun dist/index.js"]
