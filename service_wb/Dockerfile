FROM node:17.8-alpine

RUN apk add --no-cache tini && mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install && npm cache clean --force
COPY . .

EXPOSE 8083

CMD ["node", "./dist/index.js"]