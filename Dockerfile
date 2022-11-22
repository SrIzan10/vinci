FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

RUN npm i

EXPOSE 7272

RUN apk update && apk add bash ffmpeg

COPY . .

RUN npm run build

CMD node ./dist/index.js