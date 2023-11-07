FROM node:alpine

WORKDIR /app
RUN chown node:node ./
USER node

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .

CMD ["node", "./src/index.js"]