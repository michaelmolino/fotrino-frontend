FROM node:15.7.0-alpine
WORKDIR /www/fotrino/
COPY ./ ./
RUN apk --update add --no-cache --virtual .build-deps git
RUN yarn install
RUN yarn global add @quasar/cli
RUN quasar build
RUN apk del .build-deps
RUN yarn cache clean
RUN rm -rf node_modules
EXPOSE 4000
CMD quasar serve -p 4000 -H 0.0.0.0 dist/ --history
