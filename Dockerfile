FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install -g ts-node typescript

COPY . .

RUN tsc --build

CMD node dist/index.js