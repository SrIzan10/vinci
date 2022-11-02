FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

RUN npm i

RUN apk update && apk add bash ffmpeg

EXPOSE 7272

COPY . .

RUN npm run build

COPY ./.env ./dist/.env

COPY ./images/ ./dist/images/

CMD bash start.sh