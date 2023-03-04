FROM node:lts

RUN echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | debconf-set-selections
RUN apt-get update && \ 
    apt-get install -y build-essential \
    wget \
    python3 \
    make \
    gcc \ 
    libc6-dev \
    bash \
    ffmpeg \
    fontconfig
RUN wget http://ftp.de.debian.org/debian/pool/contrib/m/msttcorefonts/ttf-mscorefonts-installer_3.6_all.deb
RUN apt install ./ttf-mscorefonts-installer_3.6_all.deb -y

WORKDIR /app

COPY package.json ./

RUN npm i
RUN npm rebuild @tensorflow/tfjs-node --build-from-source

EXPOSE 7272

COPY . .

RUN npm run build

CMD node ./dist/index.js