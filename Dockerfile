FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

RUN npm i

RUN apk update && apk add bash

EXPOSE 7272

COPY . .

RUN npm run build

COPY ./.env ./dist/.env

CMD bash start.sh