FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install -g ts-node typescript

RUN tsc

COPY . .

CMD node --experimental-specifier-resolution=node dist/index.js