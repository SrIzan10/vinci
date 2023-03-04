FROM node:lts

RUN apt-get update && \ 
    apt-get install -y build-essential \
    wget \
    python3 \
    make \
    gcc \ 
    libc6-dev \
    bash \
    ffmpeg \
    msttcorefonts-installer \
    fontconfig
RUN update-ms-fonts && fc-cache -f

WORKDIR /app

COPY package.json ./

RUN npm i

EXPOSE 7272

COPY . .

RUN npm run build

CMD node ./dist/index.js