FROM nginx:stable
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y \
  nodejs
RUN echo "Node: " && node -v
RUN npm i -g npm
RUN echo "NPM: " && npm -v
COPY . /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
RUN npm i && npm run build
COPY docker/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
