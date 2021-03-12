FROM nginx:stable
RUN /bin/npm i && /bin/npm run build
COPY /dist /usr/share/nginx/html
COPY docker/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
