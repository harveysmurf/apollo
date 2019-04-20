FROM node:10.14.1-alpine
WORKDIR /apollo
COPY package.json /apollo
RUN apk add --no-cache --virtual .gyp \
        bash \
        build-base \
        libtool \
        nasm \
        automake \
        autoconf \
        python \
        make \
        g++ \
        zlib-dev \
        pkgconfig \
    && npm install \
    && apk del .gyp
COPY . /apollo
RUN node imagecacher.js
CMD [ "npm", "run", "dev" ]

EXPOSE 8082
