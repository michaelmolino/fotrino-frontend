FROM node:12
WORKDIR /www/fotrino/
COPY ./ ./
RUN yarn install
RUN yarn global add @quasar/cli
RUN quasar build
EXPOSE 4000
CMD quasar serve dist/ --history
