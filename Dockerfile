FROM node:lts-alpine

RUN apk add bash ffmpeg msttcorefonts-installer fontconfig
RUN update-ms-fonts && fc-cache -f

WORKDIR /app

COPY package.json ./

RUN npm i

EXPOSE 7272

COPY . .

RUN npm run build

RUN npm prune --production

CMD node ./dist/index.js