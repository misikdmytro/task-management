FROM node:alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile

COPY src /app/src

CMD ["node", "./src/index.js"]