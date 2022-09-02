FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install -g ts-node typescript

RUN apk update && apk add bash

EXPOSE 7272

COPY . .

CMD bash start.sh