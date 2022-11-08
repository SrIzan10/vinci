FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

RUN npm i

EXPOSE 7272

COPY ./.env ./dist/.env

COPY ./images/ ./dist/images/

COPY ./util/daysinyear.txt ./dist/util/daysinyear.txt

COPY . .

RUN npm run build

CMD bash start.sh