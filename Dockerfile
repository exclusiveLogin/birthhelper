FROM nginx:stable
RUN npm i && npm run build
COPY /dist /usr/share/nginx/html
COPY docker/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
