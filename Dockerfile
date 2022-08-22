FROM node:lts-slim

WORKDIR /app

COPY package.json ./

RUN apt update;apt install python3 -y

RUN npm install

RUN npm install -g ts-node typescript

COPY . .

CMD ts-node index.ts