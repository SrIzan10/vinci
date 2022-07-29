FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN tsc --build

CMD node dist/index.js