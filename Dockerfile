FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install -g ts-node typescript

COPY . .

CMD node --loader ts-node/esm ./index.ts