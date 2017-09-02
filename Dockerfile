FROM nginx:1.13.3

# to help docker debugging
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y update && apt-get -y install vim curl git-core gnupg2

# nodejs installation used for build tools
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y build-essential nodejs

# install tools for bundle.js
WORKDIR /usr/share/nginx/html/
COPY ./package.json /usr/share/nginx/html/
RUN npm install

WORKDIR /usr/share/nginx/html/

# nginx config
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# ezmasterization of istex-dl
# see https://github.com/Inist-CNRS/ezmaster
RUN echo '{ \
  "httpPort": 80 \
}' > /etc/ezmaster.json

# build www/dist/bundle.js and www/dist/bundle.css for production
COPY ./src /usr/share/nginx/html/src/
COPY ./public /usr/share/nginx/html/public/
RUN npm run build
