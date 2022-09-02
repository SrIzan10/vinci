FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install -g ts-node typescript

EXPOSE 7272

COPY . .

CMD ts-node --transpile-only index.ts

CMD node webserver.js