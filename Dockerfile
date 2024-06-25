FROM node:20

ENV NODE_ENV=${NODE_ENV}

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

WORKDIR /app

# Extract the version from package.json and set it as an environment variable
RUN export VERSION=$(node -p "require('./package.json').version") && echo "VERSION=VERSION" >> /etc/environment \

ENV VERSION=${VERSION}

RUN yarn global add typescript

RUN yarn install

COPY . /app


RUN yarn build

CMD ["yarn", "start"]
