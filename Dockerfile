FROM node:lts

RUN echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | debconf-set-selections
RUN add-apt-repository multiverse
RUN apt-get update && \ 
    apt-get install -y build-essential \
    wget \
    python3 \
    make \
    gcc \ 
    libc6-dev \
    bash \
    ffmpeg \
    ttf-mscorefonts-installer \
    fontconfig

WORKDIR /app

COPY package.json ./

RUN npm i

EXPOSE 7272

COPY . .

RUN npm run build

CMD node ./dist/index.js