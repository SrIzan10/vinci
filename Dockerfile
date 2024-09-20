FROM node:lts

# Build stage
FROM node:lts-alpine AS build

WORKDIR /app

RUN apk add --no-cache --virtual .gyp python3 make g++

COPY . .
RUN corepack enable yarn
RUN yarn set version 4.1.1
RUN yarn

RUN yarn build
RUN yarn cache clean

# Final stage
FROM node:lts-alpine AS final

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/assets ./assets
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
RUN apk add --no-cache ffmpeg msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f

CMD ["node", "dist/index.js"]
