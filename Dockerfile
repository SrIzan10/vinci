
FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install -g ts-node typescript

COPY . .

CMD node --experimental-specifier-resolution=node --loader ts-node/esm ./index.ts