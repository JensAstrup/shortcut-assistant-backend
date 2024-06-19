FROM node:20

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn global add typescript

RUN yarn install

COPY . /app


RUN yarn build
RUN yarn run replace-paths

CMD ["yarn", "start"]
