FROM nginx:stable
COPY ./dist /usr/share/nginx/html/dist
WORKDIR /usr/share/nginx/html
COPY docker/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
